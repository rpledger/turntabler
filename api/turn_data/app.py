from datetime import datetime

from flask import Flask, redirect, url_for
from flask import jsonify
from flask import request

from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
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
    app.app_context().push()
    db.init_app(app)
    db.create_all()
    init_test_user()
    return app


app = create_app()
jwt = JWTManager(app)
discogs = Discogs()

# Provide a method to create access tokens. The create_access_token()
# function is used to actually generate the token, and you can return
# it to the caller however you choose.
@app.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    username = request.json.get('username', None)
    password = request.json.get('password', None)
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

    # Identity can be any data that is json serializable
    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 200


@app.route('/discogsUser', methods=['GET'])
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
@app.route('/protected', methods=['GET'])
@jwt_required
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    result = []
    for user in users:
        result.append(user.to_json())

    return result


@app.route('/signup', methods=['POST'])
def signup_user():
    data = request.get_json()

    new_user = User(username=data['username'])
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'registered successfully'})


@app.route('/releases', methods=['GET'])
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


@app.route('/listens', methods=['GET'])
@jwt_required
def get_listens():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    listens = []
    for listen in user.listens:
        listens.append(listen.to_json())
    return jsonify(listens)


@app.route('/listens/<int:release_id>', methods=['POST'])
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

