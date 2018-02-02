import {Injectable, Injector} from '@angular/core';
import {AbstractDataManager} from '../data-manager/data-manager.abstract';
import {Tweet} from '../../_models/Tweet';
import {AreaData} from '../../_models/AreaData';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ScotlandDataManagerService extends AbstractDataManager {

  constructor(injector: Injector) {
    super(injector);

    this.dataFile = 'scotland-councils-simplified.json';
    this.topologyId = 'LAD13CD';
    this.topologyName = 'LAD13NM';
    this.mapType = 'scotland';
    this.regionName = 'Scotland';

    this.loadDistrictsData();

    this.listenOnSockets();
  }

  protected getRegionData(): Observable<AreaData> {
    return this._http.get<AreaData>('/api/scotland_data');
  }

  protected getDistrictData(id: string): Observable<AreaData> {
    return this._http.get<AreaData>('/api/scotland_district_data', {
      params: { id }
    });
  }

  protected getDistrictsData(ids: string[]) {
    return this._http.get<any>('/api/all_scotland_district_data', {
      params: {ids}
    });
  }

  protected listenOnSockets(): void {
    this._tweet.scotland_tweets.subscribe((msg: Tweet) => this.updateLastTweet(msg, 'scotland-boundary'));
    this._tweet.scotland_geo_tweets.subscribe((msg: Tweet) => this.updateLastTweet(msg, msg.ward));
  }
}
