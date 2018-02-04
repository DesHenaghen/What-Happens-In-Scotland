import {Observable} from 'rxjs/Observable';
import {District} from '../_models/District';
import {Tweet} from '../_models/Tweet';
import {FeatureCollection} from 'geojson';

export interface DataManagerInterface {
  getDistrict(): Observable<District>;
  getDistricts(): Observable<{[id: string]: District}>;
  getLatestTweet(): Observable<Tweet>;
  getMapTopology(): Observable<FeatureCollection<any>>;
  updateLastTweet(tweet: Tweet, id: string): void;
  loadDistrictsData(): void;
  setDistrict(area: string): void;
  getMapBoundaryId(): string;
}
