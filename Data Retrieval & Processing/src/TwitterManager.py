from TwitterAPI import TwitterAPI

import configuration
import logger as log

config = configuration.get_config()


class TwitterManager:

    def get_twitter_stream(self):
        return self.api.request('statuses/filter', {'locations': '-4.393285,55.796184, -4.090421,55.920421'})

    def __init__(self):
        # Authenticate with API
        log.logger.info("Authenticating with TwitterAPI...")
        print("Authenticating")

        self.api = TwitterAPI(
            config.CONSUMER_KEY,
            config.CONSUMER_SECRET,
            config.ACCESS_TOKEN_KEY,
            config.ACCESS_TOKEN_SECRET)

        log.logger.info("Authenticated")
        print("Authenticated")
