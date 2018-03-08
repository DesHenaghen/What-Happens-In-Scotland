from TwitterAPI import TwitterAPI

import os
import configuration
import logger as log


class TwitterManager:
    __config = configuration.get_config()
    __api = None
    __master_pid = os.getpid()

    def connect_api(self):
        if self.__api is None and os.environ.get("APP_WORKER_ID") is not None:
            self.__api = TwitterAPI(
                self.__config.CONSUMER_KEY,
                self.__config.CONSUMER_SECRET,
                self.__config.ACCESS_TOKEN_KEY,
                self.__config.ACCESS_TOKEN_SECRET)

    def get_twitter_stream(self):
        #                                                                   SW                    NE
        self.connect_api()
        if self.__api is not None:
            return self.__api.request('statuses/filter', {'locations': '-4.393285,55.796184, -4.090421,55.920421'})
        else:
            return None

    def get_scotland_twitter_stream(self):
        #                                                                   SW                     NE
        self.connect_api()
        if self.__api is not None:
            return self.__api.request('statuses/filter', {'locations': '-7.660857, 54.633631, -0.740025,60.845277'})
        else:
            return None
