from TwitterAPI import TwitterAPI

import configuration
import logger as log


class TwitterManager:
    __config = configuration.get_config()

    def get_twitter_stream(self):
        #                                                                   SW                    NE
        return self.__api.request('statuses/filter', {'locations': '-4.393285,55.796184, -4.090421,55.920421'})

    def get_scotland_twitter_stream(self):
        #                                                                   SW                     NE
        return self.__api.request('statuses/filter', {'locations': '-7.660857, 54.633631, -0.740025,60.845277'})

    def __init__(self):
        # Authenticate with API
        log.logger.info("Authenticating with TwitterAPI...")
        print("Authenticating")

        self.__api = TwitterAPI(
            self.__config.CONSUMER_KEY,
            self.__config.CONSUMER_SECRET,
            self.__config.ACCESS_TOKEN_KEY,
            self.__config.ACCESS_TOKEN_SECRET)

        log.logger.info("Authenticated")
        print("Authenticated")
