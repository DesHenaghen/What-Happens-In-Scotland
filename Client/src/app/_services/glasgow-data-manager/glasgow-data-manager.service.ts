import {Injectable, Injector} from '@angular/core';
import {AbstractDataManager} from '../data-manager/data-manager.abstract';
import {Tweet} from '../../_models/Tweet';
import {AreaData} from '../../_models/AreaData';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class GlasgowDataManagerService extends AbstractDataManager {

  constructor(injector: Injector) {
    super(injector);

    this.dataFile = 'glasgow-wards.json';
    this.topologyId = 'WD13CD';
    this.topologyName = 'WD13NM';
    this.mapType = 'glasgow';
    this.regionName = 'Glasgow';

    this.loadDistrictsData();

    this.listenOnSockets();
  }

  protected getRegionData(): Observable<AreaData> {
    return this._http.get<AreaData>('/api/glasgow_data');
  }

  protected getDistrictData(id: string): Observable<AreaData> {
    return this._http.get<AreaData>('/api/glasgow_district_data', {
      params: { id }
    });
  }

  protected getDistrictsData(ids: string[]) {
    return this._http.get<any>('/api/all_glasgow_district_data', {
      params: {ids}
    });
  }

  protected listenOnSockets(): void {
    this._tweet.glasgow_tweets.subscribe((msg: Tweet) => this.updateLastTweet(msg, 'glasgow-boundary'));
    this._tweet.glasgow_geo_tweets.subscribe((msg: Tweet) => this.updateLastTweet(msg, msg.ward));
  }
}
