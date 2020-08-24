import discogs_client
from turn_data.config import Config


class Discogs(object):
    discogsclient = discogs_client.Client('ExampleApplication/0.1')

    d = discogs_client.Client('ExampleApplication/0.1', user_token=Config.CONSUMER_TOKEN)
    me = d.identity()

    def identity(self):
        return self.me