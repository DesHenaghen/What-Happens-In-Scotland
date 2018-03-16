from TwitterAPI import TwitterAPI

import os
import configuration


class TwitterManager:
    __config = configuration.get_config()
    __api = None
    __master_pid = os.getpid()

    # Connect to the Twitter API using the stored credentials
    def connect_api(self):
        # Check to ensure that only a single thread opens a connection to the API
        # Used for Gunicorn in production deployments
        if self.__api is None and os.environ.get("APP_WORKER_ID") is None:
            self.__api = TwitterAPI(
                self.__config.CONSUMER_KEY,
                self.__config.CONSUMER_SECRET,
                self.__config.ACCESS_TOKEN_KEY,
                self.__config.ACCESS_TOKEN_SECRET)

    def get_scotland_twitter_stream(self):
        # Return a stream request from the Twitter API. Coordinates are for the bounding box of Scotland.
        #                                                                   SW                     NE
        self.connect_api()
        if self.__api is not None:
            return self.__api.request('statuses/filter', {'locations': '-7.660857, 54.633631, -0.740025,60.845277'})
        else:
            return None
