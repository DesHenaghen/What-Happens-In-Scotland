from mcVaderSentiment.mcVaderSentiment import SentimentIntensityAnalyzer, SentiText


class SentimentAnalyser:
    __analyser = SentimentIntensityAnalyzer()

    def print_sentiment_scores(self, sentence):
        snt = self.calculate_sentiment_scores(sentence)
        print("{:-<40} {}".format(sentence, str(snt)))

    def calculate_sentiment_scores(self, sentence):
        return self.__analyser.polarity_scores(sentence)

    def get_sentiment_word_scores(self, text):
        return self.__analyser.sentiment_words(text)

    @staticmethod
    def get_sentiment_words(text):
        sentitext = SentiText(text)
        return sentitext.words_and_emoticons
