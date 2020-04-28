from datetime import datetime

from flask import Flask, redirect, url_for
from flask import jsonify
from flask import request

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

user = User(id=0, username="test", email="test@test.com")
user.set_password("password")

release1 = Release(artist="Avett Brothers", title="Emotionalism", thumb="https://img.discogs.com/SwnFq01J1XAXArAhfvgtG6EgkH0=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-986527-1293716829.jpeg.jpg")
release2 = Release(artist="Avett Brothers", title="I and Love and You", thumb="https://img.discogs.com/7XGz7VuFH-dp80PqS_M-BLe7GGA=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-1963341-1262735484.jpeg.jpg")
release3 = Release(artist="Avett Brothers", title="The Second Gleam", thumb="https://img.discogs.com/7thNTBY7jzWL6Oa7QXwCssboU7k=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-2093811-1263645509.jpeg.jpg")
user.releases.append(release1)
user.releases.append(release2)
user.releases.append(release3)
listen1 = Listen(release_id=1)
listen2 = Listen(release_id=2)
user.listens.append(listen1)
user.listens.append(listen2)
db.session.add(user)
db.session.commit()


@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    user_dict = dict()
    for user in users:
        user_dict[user.id] = user.to_json()
    return user_dict


@app.route('/users', methods=['POST'])
def add_user():
    data = request.get_json()
    id = data['id']
    username = data['username']
    email = data['email']

    user = User(id=id, username=username, email=email)
    user.set_password("password")
    db.session.add(user)
    db.session.commit()


@app.route('/releases', methods=['GET'])
def get_releases():
    users = User.query.all()
    user = users[0]
    releases_dict = dict()
    for release in user.releases:
        releases_dict[release.id] = release.to_json()
    return jsonify(releases_dict)


@app.route('/listens', methods=['GET'])
def get_listens():
    users = User.query.all()
    user = users[0]
    release_listen_dict = dict()
    for listen in user.listens:
        try:
            release_listen_dict[listen.release.id].append(listen.to_json())
        except KeyError:
            release_listen_dict[listen.release.id] = [listen.to_json()]
    return jsonify(release_listen_dict)


def get_user_releases_list(id):
    user = User.query.get(id)
    releases = user.releases
    return releases


def get_user_releases_listens_list(id):
    user = User.query.get(id)
    listens = user.listens
    release_listen_dict = dict()
    for listen in listens:
        try:
            release_listen_dict[listen.release.id].append(listen)
        except KeyError:
            release_listen_dict[listen.release.id] = [listen]

    return release_listen_dict


@app.route('/listens/<int:release_id>', methods=['POST'])
def listen_now(release_id):
    # data = request.get_json()
    # dtg = datetime.strptime(data['time'])
    users = User.query.all()
    user = users[0]
    app.logger.info(release_id)
    listen = Listen(dtg=datetime.now(), release_id=release_id)
    user.listens.append(listen)
    db.session.add(user)
    db.session.commit()
    return jsonify({'listen': listen.to_json()}), 201
