import {Tweet} from './Tweet';

export class District {
  id: string;
  name: string;
  values: {x: number, y: number}[];
  average: number;
  prettyAverage: number;
  total: number;
  totals: number[];
  last_tweet: Tweet = {text: 'n/a', user: {name: 'n/a/'}};
}
