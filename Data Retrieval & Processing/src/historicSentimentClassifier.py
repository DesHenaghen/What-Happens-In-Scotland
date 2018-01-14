import DatabaseManager as db_man
from SentimentAnalyser import SentimentAnalyser

sentiment = SentimentAnalyser()
geo_tweets = db_man.get_all_geo_tweets().fetchall()
glasgow_tweets = db_man.get_all_glasgow_tweets().fetchall()

for t in geo_tweets:
    scores = sentiment.calculate_sentiment_scores(t['text'])
    db_man.update_geo_tweets_sentiment(t['id'], scores)

for t in glasgow_tweets:
    scores = sentiment.calculate_sentiment_scores(t['text'])
    db_man.update_glasgow_tweets_sentiment(t['id'], scores)

