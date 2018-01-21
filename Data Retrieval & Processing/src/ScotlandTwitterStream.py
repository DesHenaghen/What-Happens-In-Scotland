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
        # Search for tweets in Glasgow
        tweet_stream = __twitter.get_scotland_twitter_stream()
        log.logger.info("Listening for tweets...")
        print("Listening for tweets...")

        for tweet in tweet_stream:
            if tweet.get("coordinates"):
                dbMan.save_scotland_geo_tweet(tweet)
            else:
                dbMan.save_scotland_tweet(tweet)

    except ProtocolError as e:
        print("Killing myself now as a PROTOCOL ERROR occurred")
        print(e)
        sys.exit(0)

    except Exception as e:
        print("Killing myself now as an error occurred")
        print(e)
        sys.exit(0)


if __name__ == "__main__":
    main()
