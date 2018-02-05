import {Injectable, Injector} from '@angular/core';
import {AbstractDataManager} from '../data-manager/data-manager.abstract';
import {Tweet} from '../../_models/Tweet';

@Injectable()
export class ScotlandDataManagerService extends AbstractDataManager {

  constructor(injector: Injector) {
    super(injector);

    this.dataFile = 'scotland-councils-simplified.json';
    this.topologyId = 'LAD13CD';
    this.topologyName = 'LAD13NM';
    this.mapType = 'scotland';
    this.regionName = 'Scotland';
    this.districtId = 'scotland-boundary';

    this.loadDistrictsData();

    this.listenOnSockets();
  }

  protected getDistrictsData(ids: string[]) {
    return this._http.get<any>('/api/all_scotland_district_data', {
      params: {ids, region: 'true'}
    });
  }

  protected listenOnSockets(): void {
    this._tweet.scotland_district_tweets.subscribe((msg: Tweet) => this.updateLastTweet(msg, msg.ward));
  }
}
