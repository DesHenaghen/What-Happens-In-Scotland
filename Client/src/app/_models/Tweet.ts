export class Tweet {
  id?: string;
  text = '';
  user: any = {};
  name?: string;
  ward?: string;
  area?: string;
  coordinates?: number[];
  score?: number;
  text_sentiments: number[] = [];
  text_sentiment_words: string[] = [];
  date?: Date | string;
}
