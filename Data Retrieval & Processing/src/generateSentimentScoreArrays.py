import DatabaseManager as db_man
from SentimentAnalyser import SentimentAnalyser

__analyser = SentimentAnalyser()
scotland_tweets = db_man.get_all_scotland_tweets().fetchall()

values = []

print("Starting tweet processing")
for i, t in enumerate(scotland_tweets):
    sentiment_text = ' '.join(
        list(filter(lambda word: not word.startswith(('@', 'http://', 'https://', '&')), t['text'].split(' '))))
    scores = __analyser.calculate_sentiment_scores(sentiment_text)
    sentiment_words = [word.lower() for word in __analyser.get_sentiment_words(sentiment_text)]
    sentiment_word_scores = __analyser.get_sentiment_word_scores(sentiment_text)

    values.append({'t_id': t['id'], 'scores': sentiment_word_scores, 'words': sentiment_words})
    print(str(i)+"/"+str(len(scotland_tweets)))

print("Starting update process")
db_man.update_scotland_tweets_sentiment_arrays(values)
print("Finished update process")