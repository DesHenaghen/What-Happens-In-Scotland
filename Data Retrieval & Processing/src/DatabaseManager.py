import sqlalchemy
from sqlalchemy import Column, Text, Integer, REAL, DateTime, select, text
from sqlalchemy.dialects.postgresql import JSONB
import datetime

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
                                Column('coordinates', Text),
                                Column('area_id', Text),
                                Column('place', JSONB),
                                Column('text', Text),
                                Column('date', DateTime),
                                Column('user', JSONB),
                                Column('neg_sent', REAL),
                                Column('neu_sent', REAL),
                                Column('pos_sent', REAL),
                                Column('compound_sent', REAL))

__scotland_geo_tweets = sqlalchemy.Table("scotland_geo_tweets", __meta,
                                         Column('id', Integer, primary_key=True),
                                         Column('coordinates', Text),
                                         Column('area_id', Text),
                                         Column('place', JSONB),
                                         Column('text', Text),
                                         Column('date', DateTime),
                                         Column('user', JSONB),
                                         Column('neg_sent', REAL),
                                         Column('neu_sent', REAL),
                                         Column('pos_sent', REAL),
                                         Column('compound_sent', REAL))

__glasgow_tweets = sqlalchemy.Table("glasgow_tweets", __meta,
                                    Column('id', Integer, primary_key=True),
                                    Column('place', JSONB),
                                    Column('text', Text),
                                    Column('date', DateTime),
                                    Column('user', JSONB),
                                    Column('neg_sent', REAL),
                                    Column('neu_sent', REAL),
                                    Column('pos_sent', REAL),
                                    Column('compound_sent', REAL))

__scotland_tweets = sqlalchemy.Table("scotland_tweets", __meta,
                                     Column('id', Integer, primary_key=True),
                                     Column('place', JSONB),
                                     Column('text', Text),
                                     Column('date', DateTime),
                                     Column('user', JSONB),
                                     Column('neg_sent', REAL),
                                     Column('neu_sent', REAL),
                                     Column('pos_sent', REAL),
                                     Column('compound_sent', REAL))

__glasgow_wards = sqlalchemy.Table("glasgow_wards", __meta,
                                   Column('id', Text),
                                   Column('name', Text),
                                   Column('area', Text))

# Creates tables if they don't already exist
__meta.create_all()


def save_geo_tweet(tweet):
    if 'extended_tweet' in tweet:
        full_text = tweet.get('extended_tweet').get('full_text')
    else:
        full_text = tweet.get('text')

    # Tweet date & time
    float_ts = int(tweet.get('timestamp_ms')) / 1000
    date = datetime.datetime.fromtimestamp(float_ts)

    coord_array = tweet.get("coordinates").get("coordinates")
    coord_string = "(" + str(coord_array[1]) + "," + str(coord_array[0]) + ")"

    try:
        area_id = __engine.execute(
            text("select id from glasgow_wards where area @> '" + coord_string + "'")
        ).fetchone()[0]
    except TypeError as e:
        area_id = None

    # Tweet sentiment scores
    scores = __analyser.calculate_sentiment_scores(full_text)

    statement = __geo_tweets.insert().values(
        coordinates=coord_string,
        area_id=area_id,
        place=tweet.get("place"),
        text=full_text,
        date=date,
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


def save_scotland_geo_tweet(tweet):
    if 'extended_tweet' in tweet:
        full_text = tweet.get('extended_tweet').get('full_text')
    else:
        full_text = tweet.get('text')

    # Tweet date & time
    float_ts = int(tweet.get('timestamp_ms')) / 1000
    date = datetime.datetime.fromtimestamp(float_ts)

    coord_array = tweet.get("coordinates").get("coordinates")
    coord_string = "(" + str(coord_array[1]) + "," + str(coord_array[0]) + ")"

    # Tweet sentiment scores
    scores = __analyser.calculate_sentiment_scores(full_text)

    statement = __scotland_geo_tweets.insert().values(
        coordinates=coord_string,
        place=tweet.get("place"),
        text=full_text,
        date=date,
        user=tweet.get("user"),
        neg_sent=scores.get('neg'),
        neu_sent=scores.get('neu'),
        pos_sent=scores.get('pos'),
        compound_sent=scores.get('compound')
    )

    __engine.execute(statement)

    # logger.info(json.dumps(tweet, indent=4, sort_keys=True))
    log.logger.info("added to scotland_geo_tweets")
    print("added to scotland_geo_tweets")
    print(tweet)


def save_glasgow_tweet(tweet):
    if 'extended_tweet' in tweet:
        full_text = tweet.get('extended_tweet').get('full_text')
    else:
        full_text = tweet.get('text')

    # Tweet date & time
    float_ts = int(tweet.get('timestamp_ms')) / 1000
    date = datetime.datetime.fromtimestamp(float_ts)

    # Tweet sentiment scores
    scores = __analyser.calculate_sentiment_scores(full_text)

    statement = __glasgow_tweets.insert().values(
        place=tweet.get("place"),
        text=full_text,
        date=date,
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


def save_scotland_tweet(tweet):
    if 'extended_tweet' in tweet:
        full_text = tweet.get('extended_tweet').get('full_text')
    else:
        full_text = tweet.get('text')

    # Tweet date & time
    float_ts = int(tweet.get('timestamp_ms')) / 1000
    date = datetime.datetime.fromtimestamp(float_ts)

    # Tweet sentiment scores
    scores = __analyser.calculate_sentiment_scores(full_text)

    statement = __scotland_tweets.insert().values(
        place=tweet.get("place"),
        text=full_text,
        date=date,
        user=tweet.get("user"),
        neg_sent=scores.get('neg'),
        neu_sent=scores.get('neu'),
        pos_sent=scores.get('pos'),
        compound_sent=scores.get('compound')
    )

    __engine.execute(statement)

    # logger.info(json.dumps(tweet, indent=4, sort_keys=True))
    log.logger.info("added to scotland_tweets")
    print("added to scotland tweets")
    print(tweet)


def get_all_glasgow_tweets():
    return select([
        __glasgow_tweets.c.id,
        __glasgow_tweets.c.text,
        __glasgow_tweets.c.timestamp
    ]).execute()


def get_all_geo_tweets():
    return select([
        __geo_tweets.c.id,
        __geo_tweets.c.text,
        __geo_tweets.c.timestamp
    ]).execute()


def __update_tweets_sentiment(table, tweet_id, sentiment, date):
    table.update() \
        .values(
        neg_sent=sentiment.get('neg'),
        neu_sent=sentiment.get('neu'),
        pos_sent=sentiment.get('pos'),
        compound_sent=sentiment.get('compound'),
        date=date
    ).where(table.c.id == tweet_id).execute()


def update_glasgow_tweets_sentiment(tweet_id, sentiment, date):
    __update_tweets_sentiment(__glasgow_tweets, tweet_id, sentiment, date)


def update_geo_tweets_sentiment(tweet_id, sentiment, date):
    __update_tweets_sentiment(__geo_tweets, tweet_id, sentiment, date)
