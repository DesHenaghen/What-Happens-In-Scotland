from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer


class SentimentAnalyser:
    analyser = SentimentIntensityAnalyzer()

    def print_sentiment_scores(self, sentence):
        snt = self.analyser.polarity_scores(sentence)
        print("{:-<40} {}".format(sentence, str(snt)))
