import sqlalchemy
from sqlalchemy import Column, Text, Integer, REAL, select
from sqlalchemy.dialects.postgresql import JSONB

import logger as log
import configuration
from SentimentAnalyser import SentimentAnalyser

__config = configuration.get_config()
__connection_string = __config.generate_connection_string()
print(__connection_string)

__analyser = SentimentAnalyser()

__db = sqlalchemy.create_engine(__connection_string)
__engine = __db.connect()
__meta = sqlalchemy.MetaData(__engine)

# Define table schemas
__geo_tweets = sqlalchemy.Table("geo_tweets", __meta,
                                Column('id', Integer, primary_key=True),
                                Column('coordinates', JSONB),
                                Column('place', JSONB),
                                Column('text', Text),
                                Column('timestamp', Text),
                                Column('user', JSONB),
                                Column('neg_sent', REAL),
                                Column('neu_sent', REAL),
                                Column('pos_sent', REAL),
                                Column('compound_sent', REAL))

__glasgow_tweets = sqlalchemy.Table("glasgow_tweets", __meta,
                                    Column('id', Integer, primary_key=True),
                                    Column('place', JSONB),
                                    Column('text', Text),
                                    Column('timestamp', Text),
                                    Column('user', JSONB),
                                    Column('neg_sent', REAL),
                                    Column('neu_sent', REAL),
                                    Column('pos_sent', REAL),
                                    Column('compound_sent', REAL))

# Creates tables if they don't already exist
__meta.create_all()


def save_geo_tweet(tweet):
    if 'extended_tweet' in tweet:
        text = tweet.get('extended_tweet').get('full_text')
    else:
        text = tweet.get('text')

    scores = __analyser.calculate_sentiment_scores(text)

    statement = __geo_tweets.insert().values(
        coordinates=tweet.get("coordinates"),
        place=tweet.get("place"),
        text=text,
        timestamp=tweet.get("timestamp_ms"),
        user=tweet.get("user"),
        neg_sent=scores.get('neg'),
        neu_sent=scores.get('neu'),
        pos_sent=scores.get('pos'),
        compound_sent=scores.get('compound')
    )

    __engine.execute(statement)

    # logger.info(json.dumps(tweet, indent=4, sort_keys=True))
    log.logger.info("added to geo_tweets")
    # print("added to geo_tweets")
    # print(tweet)


def save_glasgow_tweet(tweet):
    if 'extended_tweet' in tweet:
        text = tweet.get('extended_tweet').get('full_text')
    else:
        text = tweet.get('text')

    scores = __analyser.calculate_sentiment_scores(text)

    statement = __glasgow_tweets.insert().values(
        place=tweet.get("place"),
        text=text,
        timestamp=tweet.get("timestamp_ms"),
        user=tweet.get("user"),
        neg_sent=scores.get('neg'),
        neu_sent=scores.get('neu'),
        pos_sent=scores.get('pos'),
        compound_sent=scores.get('compound')
    )

    __engine.execute(statement)

    # logger.info(json.dumps(tweet, indent=4, sort_keys=True))
    log.logger.info("added to glasgow_tweets")
    # print("added to glasgow_tweets")
    # print(tweet)


def get_all_glasgow_tweets():
    return select([__glasgow_tweets.c.id, __glasgow_tweets.c.text]).execute()


def get_all_geo_tweets():
    return select([__glasgow_tweets.c.id, __glasgow_tweets.c.text]).execute()


def __update_tweets_sentiment(table, tweet_id, sentiment):
    table.update()\
        .values(
            neg_sent=sentiment.get('neg'),
            neu_sent=sentiment.get('neu'),
            pos_sent=sentiment.get('pos'),
            compound_sent=sentiment.get('compound')
        ).where(__glasgow_tweets.c.id == tweet_id).execute()


def update_glasgow_tweets_sentiment(tweet_id, sentiment):
    __update_tweets_sentiment(__glasgow_tweets, tweet_id, sentiment)


def update_geo_tweets_sentiment(tweet_id, sentiment):
    __update_tweets_sentiment(__geo_tweets, tweet_id, sentiment)

