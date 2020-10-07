import os


class Config(object):
    DISCOGS_CONSUMER_KEY = os.environ.get('DISCOGS_CONSUMER_KEY') or 'discogs-consumer-key'
    DISCOGS_CONSUMER_SECRET = os.environ.get('DISCOGS_CONSUMER_SECRET') or 'discogs-consumer-token'
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'super-secret'  # Change this!
    DISCOGS_USER_TOKEN = os.environ.get('DISCOGS_USER_TOKEN') or 'discogs-user-token'
