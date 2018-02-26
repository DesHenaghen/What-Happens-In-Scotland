import {Tweet} from './Tweet';

export class District {
  id: string;
  name: string;
  values: {x: number, y: number}[];
  average = 0;
  prettyAverage = 0;
  common_emote_words?: string[];
  total: number;
  totals: number[];
  last_tweets: Tweet[] = [];
}
