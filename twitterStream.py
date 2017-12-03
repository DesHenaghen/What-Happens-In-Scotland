import logging
import sqlalchemy
from sqlalchemy import Column, Text
from sqlalchemy.dialects.postgresql import JSONB

from TwitterAPI import TwitterAPI

# Set up logger
logger = logging.getLogger('twitter_stream')
hdlr = logging.FileHandler('twitter_stream.log')
formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
hdlr.setFormatter(formatter)
logger.addHandler(hdlr)
logger.setLevel(logging.INFO)

# PostgreSQL Connections
username = "whig"
password = "382FkjBoQPfk"
hostname = "whathappensinglasgow.cszk7qzakguv.eu-west-2.rds.amazonaws.com"
port = "5432"
database = "tweets"

connection_string = "postgresql://{}:{}@{}:{}/{}".format(
    username, password, hostname, port, database)
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

# Authenticate with API
logger.info("Authenticating with TwitterAPI...")
consumer_key = "YEzxsl5oNKfyYN4QPnRjJOtly"
consumer_secret = "sdB9kCZGpJ2WHSHowzI3u42dsvcLje8AXrcy1Po4a5x4kH4EzE"
access_token_key = "924952244293955584-fvogKvX6SWdVoaZYqhvDAGgHPcVaG9c"
access_token_secret = "rvIKixbkoziz9fqSqDa1oa5bQ1okjXM7xJ9z2JqjImf0H"

api = TwitterAPI(consumer_key, consumer_secret, access_token_key, access_token_secret)
logger.info("Authenticated")

# Search for tweets in Glasgow
tweetStream = api.request('statuses/filter', {'locations': '-4.393285,55.796184, -4.090421,55.920421'})
logger.info("Listening for tweets...")
for tweet in tweetStream:
    statement = ""
    if tweet.get("coordinates"):
        statement = geo_tweets.insert().values(
            coordinates=tweet.get("coordinates"),
            place=tweet.get("place"),
            text=tweet.get("text"),
            timestamp=tweet.get("timestamp_ms"),
            user=tweet.get("user")
        )

        # logger.info(json.dumps(tweet, indent=4, sort_keys=True))
        logger.info("added to geo_tweets")

    else:
        statement = glasgow_tweets.insert().values(
            place=tweet.get("place"),
            text=tweet.get("text"),
            timestamp=tweet.get("timestamp_ms"),
            user=tweet.get("user")
        )
        # logger.info(json.dumps(tweet, indent=4, sort_keys=True))
        logger.info("added to glasgow_tweets")

    engine.execute(statement)
