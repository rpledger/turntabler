from datetime import datetime

from flask import Flask, redirect, url_for
from flask import jsonify
from flask import request

from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    jwt_refresh_token_required, create_refresh_token,
    get_jwt_identity, set_access_cookies,
    set_refresh_cookies, unset_jwt_cookies
)

from turn_data.models import db, User, Release, Listen
from turn_data.config import Config
from turn_data.discogs import Discogs


POSTGRES_URL = "db:5432"
POSTGRES_USER = "postgres"
POSTGRES_PW = "password"
POSTGRES_DB = "postgres"
DB_URL = 'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(user=POSTGRES_USER,pw=POSTGRES_PW,url=POSTGRES_URL,db=POSTGRES_DB)


def init_test_user():
    testuser = User.query.get(0)
    if testuser is None:
        testuser = User(id=0, username="test")
        testuser.set_password("password")
        db.session.add(testuser)
        db.session.commit()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    # Configure application to store JWTs in cookies
    app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    # Only allow JWT cookies to be sent over https. In production, this
    # should likely be True
    app.config['JWT_COOKIE_SECURE'] = False
    # Set the cookie paths, so that you are only sending your access token
    # cookie to the access endpoints, and only sending your refresh token
    # to the refresh endpoint. Technically this is optional, but it is in
    # your best interest to not send additional cookies in the request if
    # they aren't needed.
    app.config['JWT_ACCESS_COOKIE_PATH'] = '/api/'
    app.config['JWT_REFRESH_COOKIE_PATH'] = '/token/refresh'
    # Enable csrf double submit protection. See this for a thorough
    # explanation: http://www.redotheweb.com/2015/11/09/api-security.html
    app.config['JWT_COOKIE_CSRF_PROTECT'] = True
    app.config['JWT_CSRF_CHECK_FORM'] = True
    app.app_context().push()
    db.init_app(app)
    db.create_all()
    init_test_user()
    return app


app = create_app()
jwt = JWTManager(app)
discogs = Discogs()

# With JWT_COOKIE_CSRF_PROTECT set to True, set_access_cookies() and
# set_refresh_cookies() will now also set the non-httponly CSRF cookies
# as well
@app.route('/token/auth', methods=['POST'])
def token_login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    if not username:
        return jsonify({"msg": "Missing username parameter"}), 400
    if not password:
        return jsonify({"msg": "Missing password parameter"}), 400

    user = User.query.filter_by(username=username).first()

    if user:
        if not user.check_password(password):
            return jsonify({"msg": "Bad username or password"}), 401
    else:
        return jsonify({"msg": "Bad username"}), 401

    # Create the tokens we will be sending back to the user
    access_token = create_access_token(identity=username)
    refresh_token = create_refresh_token(identity=username)

    # Set the JWTs and the CSRF double submit protection cookies
    # in this response
    resp = jsonify({'login': True})
    set_access_cookies(resp, access_token)
    set_refresh_cookies(resp, refresh_token)
    return resp, 200


@app.route('/token/refresh', methods=['POST'])
@jwt_refresh_token_required
def token_refresh():
    # Create the new access token
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)

    # Set the access JWT and CSRF double submit protection cookies
    # in this response
    resp = jsonify({'refresh': True})
    set_access_cookies(resp, access_token)
    return resp, 200


# Because the JWTs are stored in an httponly cookie now, we cannot
# log the user out by simply deleting the cookie in the frontend.
# We need the backend to send us a response to delete the cookies
# in order to logout. unset_jwt_cookies is a helper function to
# do just that.
@app.route('/token/remove', methods=['POST'])
def token_logout():
    resp = jsonify({'logout': True})
    unset_jwt_cookies(resp)
    return resp, 200


@app.route('/api/example', methods=['GET'])
@jwt_required
def token_protected():
    username = get_jwt_identity()
    return jsonify({'hello': 'from {}'.format(username)}), 200


# Provide a method to create access tokens. The create_access_token()
# function is used to actually generate the token, and you can return
# it to the caller however you choose.
# @app.route('/login', methods=['POST'])
# def login():
#     if not request.is_json:
#         return jsonify({"msg": "Missing JSON in request"}), 400
#
#     username = request.json.get('username', None)
#     password = request.json.get('password', None)
#     if not username:
#         return jsonify({"msg": "Missing username parameter"}), 400
#     if not password:
#         return jsonify({"msg": "Missing password parameter"}), 400
#
#     user = User.query.filter_by(username=username).first()
#
#     if user:
#         if not user.check_password(password):
#             return jsonify({"msg": "Bad username or password"}), 401
#     else:
#         return jsonify({"msg": "Bad username"}), 401
#
#     # Identity can be any data that is json serializable
#     access_token = create_access_token(identity=username)
#     return jsonify(access_token=access_token), 200


@app.route('/api/discogs/user', methods=['GET'])
def get_discogs_user():
    me = discogs.identity()
    user = User.query.get(0)

    collections = me.collection_folders
    added_count = 0
    for release in collections[0].releases:
        r = release.release

        if not any(rel.id == r.id for rel in user.releases):
            release = Release(id=r.id,
                              artist=r.artists[0].name,
                              title=r.title,
                              thumb=r.thumb
                              )

            user.releases.append(release)
            db.session.add(user)
            db.session.commit()
            added_count += 1

    return jsonify({"msg": "Added " + str(added_count) + " releases to " + user.username}), 200

# Protect a view with jwt_required, which requires a valid access token
# in the request to access.
@app.route('/api/protected', methods=['GET'])
@jwt_required
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    result = []
    for user in users:
        result.append(user.to_json())

    return result


@app.route('/api/signup', methods=['POST'])
def signup_user():
    data = request.get_json()

    new_user = User(username=data['username'])
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'registered successfully'})


@app.route('/api/releases', methods=['GET'])
@jwt_required
def get_releases():
    current_user = get_jwt_identity()
    # users = User.query.all()
    # user = users[0]
    user = User.query.filter_by(username=current_user).first()
    releases = []
    for release in user.releases:
        releases.append(release.to_json())
    return jsonify(releases)


@app.route('/api/listens', methods=['GET'])
@jwt_required
def get_listens():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    listens = []
    for listen in user.listens:
        listens.append(listen.to_json())
    return jsonify(listens)


@app.route('/api/listens/<int:release_id>', methods=['POST'])
@jwt_required
def listen_now(release_id):
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    app.logger.info(release_id)
    listen = Listen(dtg=datetime.now(), release_id=release_id)
    user.listens.append(listen)
    db.session.add(user)
    db.session.commit()
    return jsonify({'listen': listen.to_json()}), 201

