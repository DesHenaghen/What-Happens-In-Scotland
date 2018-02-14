export class Tweet {
  id?: string;
  text: string;
  user: any;
  ward?: string;
  coordinates?: number[];
  score?: number;
  text_sentiments: number[];
  text_sentiment_words: string[];
}
