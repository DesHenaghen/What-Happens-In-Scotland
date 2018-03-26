export class Tweet {
  id? = '';
  text = ' ';
  user: any = {};
  name?: string;
  ward? = '';
  area? = '';
  coordinates?: number[];
  score?: number;
  text_sentiments: number[] = [];
  text_sentiment_words: string[] = [];
  date?: string;
}

