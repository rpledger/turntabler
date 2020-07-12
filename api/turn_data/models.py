from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

user_release = db.Table('user_release',
    db.Column('release_id', db.Integer, db.ForeignKey('release.id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True)
)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    #email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128))

    releases = db.relationship('Release', secondary=user_release, lazy='subquery',
                           backref=db.backref('users', lazy=True))

    def __repr__(self):
        return '<User %r>' % self.username

    def set_password(self, password):
        self.password = generate_password_hash(password, method='sha256')

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_json(self):
        return {
            'username': self.username
        }


class Release(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    artist = db.Column(db.String(80), nullable=False)
    thumb = db.Column(db.String(300), nullable=True)

    def __repr__(self):
        return '<Release %r>' % self.title

    def to_json(self):
        return {
            'id': self.id,
            'title': self.title,
            'artist': self.artist,
            'thumb': self.thumb
        }


class Listen(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    dtg = db.Column(db.DateTime, nullable=False,
        default=datetime.utcnow)
    release_id = db.Column(db.Integer, db.ForeignKey('release.id'),
                          nullable=False)

    user_id = db.Column(db.ForeignKey(User.id))
    user = db.relationship(User, backref='listens')

    release_id = db.Column(db.ForeignKey(Release.id))
    release = db.relationship(Release, backref='listens')

    def __repr__(self):
        return '<Listen %r>' % self.dtg

    def to_json(self):
        return {
            'dtg': self.dtg,
            'release_id': self.release_id,
            'artist': self.release.artist,
            'title': self.release.title,
            'user': self.user.id,
            'thumb': self.release.thumb
        }
