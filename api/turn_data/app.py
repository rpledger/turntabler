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


POSTGRES_URL = "db:5432"
POSTGRES_USER = "postgres"
POSTGRES_PW = "password"
POSTGRES_DB = "postgres"
DB_URL = 'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(user=POSTGRES_USER,pw=POSTGRES_PW,url=POSTGRES_URL,db=POSTGRES_DB)


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.app_context().push()
    db.init_app(app)
    db.create_all()
    return app


app = create_app()
jwt = JWTManager(app)

testuser = User(id=0, username="test")
testuser.set_password("password")

release1 = Release(artist="Avett Brothers", title="Emotionalism", thumb="https://img.discogs.com/SwnFq01J1XAXArAhfvgtG6EgkH0=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-986527-1293716829.jpeg.jpg")
release2 = Release(artist="Avett Brothers", title="I and Love and You", thumb="https://img.discogs.com/7XGz7VuFH-dp80PqS_M-BLe7GGA=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-1963341-1262735484.jpeg.jpg")
release3 = Release(artist="Avett Brothers", title="The Second Gleam", thumb="https://img.discogs.com/7thNTBY7jzWL6Oa7QXwCssboU7k=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-2093811-1263645509.jpeg.jpg")
testuser.releases.append(release1)
testuser.releases.append(release2)
testuser.releases.append(release3)
listen1 = Listen(release_id=1)
listen2 = Listen(release_id=2)
testuser.listens.append(listen1)
testuser.listens.append(listen2)
db.session.add(testuser)
db.session.commit()

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


# @app.route('/signup', methods=['GET', 'POST'])
# def signup_user():
#  data = request.get_json()
#
#  new_user = User(name=data['name'])
#  user.set_password("password")
#  db.session.add(new_user)
#  db.session.commit()
#
#  return jsonify({'message': 'registered successfully'})
#
#
# @app.route('/login', methods=['GET', 'POST'])
# def login_user():
#
#   auth = request.authorization
#
#   if not auth or not auth.username or not auth.password:
#      return make_response('could not verify', 401, {'WWW.Authentication': 'Basic realm: "login required"'})
#
#   user = Users.query.filter_by(name=auth.username).first()
#
#   if check_password(auth.password):
#      token = jwt.encode({'public_id': user.id, 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])
#      return jsonify({'token' : token.decode('UTF-8')})
#
#   return make_response('could not verify',  401, {'WWW.Authentication': 'Basic realm: "login required"'})


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
    # users = User.query.all()
    # user = users[0]
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    listens = []
    for listen in user.listens:
        listens.append(listen.to_json())
    return jsonify(listens)


@app.route('/listens/<int:release_id>', methods=['POST'])
def listen_now(release_id):
    users = User.query.all()
    user = users[0]
    app.logger.info(release_id)
    listen = Listen(dtg=datetime.now(), release_id=release_id)
    user.listens.append(listen)
    db.session.add(user)
    db.session.commit()
    return jsonify({'listen': listen.to_json()}), 201
