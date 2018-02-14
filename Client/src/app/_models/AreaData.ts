import {LineChartValues} from './LineChartValues';
import {Tweet} from './Tweet';

export class AreaData {
  values: LineChartValues[];
  total: number;
  totals: number[];
  last_tweet: Tweet;
  common_emote_words: string[];
}
