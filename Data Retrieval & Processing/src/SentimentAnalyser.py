from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer


class SentimentAnalyser:
    __analyser = SentimentIntensityAnalyzer()

    def print_sentiment_scores(self, sentence):
        snt = self.calculate_sentiment_scores(sentence)
        print("{:-<40} {}".format(sentence, str(snt)))

    def calculate_sentiment_scores(self, sentence):
        return self.__analyser.polarity_scores(sentence)
