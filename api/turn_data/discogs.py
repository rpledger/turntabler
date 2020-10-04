import discogs_client
from discogs_client.exceptions import HTTPError
from turn_data.config import Config


class Discogs(object):

    # Set unique user-agent
    user_agent = 'turntabler/0.1'

    # Instantiate discogs_client obj
    discogsclient = discogs_client.Client(user_agent)

    # Prepare the client with API consumer data
    discogsclient.set_consumer_key(Config.DISCOGS_CONSUMER_KEY, Config.DISCOGS_CONSUMER_SECRET)
    token, secret, url = discogsclient.get_authorize_url()

    print(' == Request Token == ')
    print(f'    * oauth_token        = {token}')
    print(f'    * oauth_token_secret = {secret}')
    print()

    user = None

    def get_identity(self):
        if self.user is None:
            self.user = self.discogsclient.identity()
            return self.user
        return self.user

    def get_url(self):
        return self.url

    def set_access_token(self, oauth_verifier):
        try:
            access_token, access_secret = self.discogsclient.get_access_token(oauth_verifier)
            print(' == Access Token ==')
            print(f'    * oauth_token        = {access_token}')
            print(f'    * oauth_token_secret = {access_secret}')
            print(' Authentication complete. Future requests will be signed with the above tokens.')
        except HTTPError as http_error:
            print('Unable to authenticate.')
            raise http_error
