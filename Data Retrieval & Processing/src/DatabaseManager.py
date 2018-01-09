import sqlalchemy
from sqlalchemy import Column, Text
from sqlalchemy.dialects.postgresql import JSONB

import logger as log
import configuration

config = configuration.DevelopmentConfig()
connection_string = config.generate_connection_string()

db = sqlalchemy.create_engine(connection_string)
engine = db.connect()
meta = sqlalchemy.MetaData(engine)

# Define table schemas
geo_tweets = sqlalchemy.Table("geo_tweets", meta,
                              Column('coordinates', JSONB),
                              Column('place', JSONB),
                              Column('text', Text),
                              Column('timestamp', Text),
                              Column('user', JSONB))

glasgow_tweets = sqlalchemy.Table("glasgow_tweets", meta,
                                  Column('place', JSONB),
                                  Column('text', Text),
                                  Column('timestamp', Text),
                                  Column('user', JSONB))

# Creates tables if they don't already exist
meta.create_all()


def save_geo_tweet(tweet):
    statement = geo_tweets.insert().values(
        coordinates=tweet.get("coordinates"),
        place=tweet.get("place"),
        text=tweet.get("text"),
        timestamp=tweet.get("timestamp_ms"),
        user=tweet.get("user")
    )

    engine.execute(statement)

    # logger.info(json.dumps(tweet, indent=4, sort_keys=True))
    log.logger.info("added to geo_tweets")
    print("added to geo_tweets")
    print(tweet)


def save_glasgow_tweet(tweet):
    statement = glasgow_tweets.insert().values(
        place=tweet.get("place"),
        text=tweet.get("text"),
        timestamp=tweet.get("timestamp_ms"),
        user=tweet.get("user")
    )

    engine.execute(statement)

    # logger.info(json.dumps(tweet, indent=4, sort_keys=True))
    log.logger.info("added to glasgow_tweets")
    print("added to glasgow_tweets")
    print(tweet)
