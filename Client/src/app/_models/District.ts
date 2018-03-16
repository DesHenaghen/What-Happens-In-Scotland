import {Tweet} from './Tweet';

export class District {
  id = '';
  name = '';
  values: {x: number, y: number}[] = [];
  average = 0;
  prettyAverage = 0;
  common_emote_words?: string[] = [];
  total = 0;
  totals: number[] = [];
  last_tweets: Tweet[] = [];
}
