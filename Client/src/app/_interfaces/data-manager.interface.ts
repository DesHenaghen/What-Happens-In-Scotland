import {Observable} from 'rxjs/Observable';
import {District} from '../_models/District';
import {Tweet} from '../_models/Tweet';
import {FeatureCollection} from 'geojson';
import {MapModes} from '../_models/MapModes';
import * as moment from 'moment';

export interface DataManagerInterface {
  regionName: string;
  mapType: string;
  dataFile: string;
  districtId: string;
  topologyId: string;
  topologyName: string;
  mapMode: MapModes;
  allowRegionPulsing: boolean;

  getDistrict(): Observable<District>;
  getDistricts(): Observable<{[id: string]: District}>;
  getLatestTweet(): Observable<Tweet>;
  getTweets(): Observable<{[id: string]: Tweet[]}>;
  fetchDistrictTweets(date: moment.Moment, append: boolean);
  getMapTopology(): Observable<FeatureCollection<any>>;
  getLoadedData(): Observable<boolean>;
  updateLastTweet(tweet: Tweet, id: string): void;
  loadDistrictsData(): void;
  refreshAllDistrictsData(date: Date, period: number): void;
  setDistrict(area: string): void;
  getMapBoundaryId(): string;
  highlightEmotiveWords(word: string, tweet: Tweet, new_words: string[], new_scores: number[]): string;
  setUpdateTweets(bool: boolean): void;
}
