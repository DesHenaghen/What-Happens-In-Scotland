import {Observable} from 'rxjs/Observable';
import {District} from '../_models/District';
import {Tweet} from '../_models/Tweet';
import {FeatureCollection} from 'geojson';
import {MapModes} from '../_models/MapModes';

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
  getMapTopology(): Observable<FeatureCollection<any>>;
  updateLastTweet(tweet: Tweet, id: string): void;
  loadDistrictsData(): void;
  setDistrict(area: string): void;
  getMapBoundaryId(): string;
}
