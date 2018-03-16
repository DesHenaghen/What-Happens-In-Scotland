import _thread

import sys
from urllib3.exceptions import ProtocolError

import logger as log
import configuration
import DatabaseManager as dbMan
import TwitterManager as twMan

__config = configuration.get_config()
__twitter = twMan.TwitterManager()


def main():
    try:
        # Search for tweets in Scotland
        print("Getting twitter stream")
        tweet_stream = __twitter.get_scotland_twitter_stream()

        if tweet_stream is not None:
            print("Listening for tweets...")
            for tweet in tweet_stream:
                dbMan.save_scotland_tweet(tweet)

    except ProtocolError as e:
        print("Killing myself now as a PROTOCOL ERROR occurred")
        print(e)
        _thread.interrupt_main()

    except Exception as e:
        print("Killing myself now as an error occurred")
        print(e)
        _thread.interrupt_main()


if __name__ == "__main__":
    main()

