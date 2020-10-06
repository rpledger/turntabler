import discogs_client
from discogs_client.exceptions import HTTPError
from turn_data.config import Config


class Discogs:

    def __init__(self, logger=None, token=None, secret=None):
        self.token = token
        self.secret = secret
        self.url = None

        # Set unique user-agent
        user_agent = 'turntabler/0.1'

        # Instantiate discogs_client obj

        if token and secret:
            logger.info("inside discogs token: " + token + " secret: " + secret)
            self.discogsclient = discogs_client.Client(user_agent, token=token, secret=secret, consumer_key=Config.DISCOGS_CONSUMER_KEY, consumer_secret=Config.DISCOGS_CONSUMER_SECRET)
        else:
            self.discogsclient = discogs_client.Client(user_agent, consumer_key=Config.DISCOGS_CONSUMER_KEY, consumer_secret=Config.DISCOGS_CONSUMER_SECRET)

        # Prepare the client with API consumer data
        # self.discogsclient.set_consumer_key(Config.DISCOGS_CONSUMER_KEY, Config.DISCOGS_CONSUMER_SECRET)


        # TODO: add callback_url when not using localhost

        self.user = None

    # print(' == Request Token == ')
    # print(f'    * oauth_token        = {token}')
    # print(f'    * oauth_token_secret = {secret}')
    # print()
    #
    # user = None

    def get_identity(self):
        if self.user is None:
            self.user = self.discogsclient.identity()
            return self.user
        return self.user

    def get_url(self):
        return self.discogsclient.get_authorize_url()

    def set_access_token(self, oauth_verifier):
        try:
            return self.discogsclient.get_access_token(oauth_verifier)
            # print(' == Access Token ==')
            # print(f'    * oauth_token        = {access_token}')
            # print(f'    * oauth_token_secret = {access_secret}')
            # print(' Authentication complete. Future requests will be signed with the above tokens.')
        except HTTPError as http_error:
            print('Unable to authenticate.')
            raise http_error
