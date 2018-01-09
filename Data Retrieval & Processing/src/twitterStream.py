import sys
from urllib3.exceptions import ProtocolError

import logger as log
import configuration
import DatabaseManager as db_man
import TwitterManager as tw_man

# config = configuration.ProductionConfig()
config = configuration.DevelopmentConfig()
twitter = tw_man.TwitterManager()


def main():
    try:
        # Search for tweets in Glasgow
        tweet_stream = twitter.get_twitter_stream()
        log.logger.info("Listening for tweets...")
        print("Listening for tweets...")

        for tweet in tweet_stream:
            if tweet.get("coordinates"):
                db_man.save_geo_tweet(tweet)
            else:
                db_man.save_glasgow_tweet(tweet)

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
