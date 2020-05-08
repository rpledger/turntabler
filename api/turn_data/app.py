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

user = User(id=0, username="test")
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
    result = []
    for user in users:
        result.append(user.to_json())

    return result


@app.route('/signup', methods=['GET', 'POST'])
def signup_user():
 data = request.get_json()

 new_user = User(name=data['name'])
 user.set_password("password")
 db.session.add(new_user)
 db.session.commit()

 return jsonify({'message': 'registered successfully'})


@app.route('/login', methods=['GET', 'POST'])
def login_user():

  auth = request.authorization

  if not auth or not auth.username or not auth.password:
     return make_response('could not verify', 401, {'WWW.Authentication': 'Basic realm: "login required"'})

  user = Users.query.filter_by(name=auth.username).first()

  if check_password(auth.password):
     token = jwt.encode({'public_id': user.id, 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])
     return jsonify({'token' : token.decode('UTF-8')})

  return make_response('could not verify',  401, {'WWW.Authentication': 'Basic realm: "login required"'})


@app.route('/releases', methods=['GET'])
def get_releases():
    users = User.query.all()
    user = users[0]
    releases = []
    for release in user.releases:
        releases.append(release.to_json())
    return jsonify(releases)


@app.route('/listens', methods=['GET'])
def get_listens():
    users = User.query.all()
    user = users[0]
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
