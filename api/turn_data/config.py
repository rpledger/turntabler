import os


class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'super-secret'  # Change this!
    CONSUMER_TOKEN = os.environ.get('DISCOGS_USER_TOKEN') or 'discogs-user-token'
