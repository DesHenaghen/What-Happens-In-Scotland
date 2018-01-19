import datetime
import gevent.monkey
gevent.monkey.patch_all()

import DatabaseManager as db_man
from SentimentAnalyser import SentimentAnalyser

sentiment = SentimentAnalyser()
geo_tweets = db_man.get_all_geo_tweets().fetchall()
glasgow_tweets = db_man.get_all_glasgow_tweets().fetchall()


def updateGeoTweet(t):
    scores = sentiment.calculate_sentiment_scores(t['text'])
    float_ts = int(t['timestamp']) / 1000
    date = datetime.datetime.fromtimestamp(float_ts)
    db_man.update_geo_tweets_sentiment(t['id'], scores, date)


def updateGlasgowTweet(t):
    scores = sentiment.calculate_sentiment_scores(t['text'])
    float_ts = int(t['timestamp']) / 1000
    date = datetime.datetime.fromtimestamp(float_ts)
    db_man.update_glasgow_tweets_sentiment(t['id'], scores, date)


geojobs = [gevent.spawn(updateGeoTweet, t) for t in geo_tweets]
gevent.wait(geojobs)

glasgowjobs = [gevent.spawn(updateGlasgowTweet, t) for t in glasgow_tweets]
gevent.wait(glasgowjobs)
