import {Tweet} from './Tweet';

export class District {
  id: string;
  name: string;
  // TODO: NOT ANY!
  values: {x: number, y: number}[];
  average: number;
  prettyAverage: number;
  total: number;
  totals: number[];
  // TODO: You know the drill by now
  last_tweet: Tweet = {text: 'n/a', user: {name: 'n/a/'}};
}
