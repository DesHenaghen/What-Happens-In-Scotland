import {Injectable, Injector} from '@angular/core';
import {AbstractDataManager} from '../data-manager/data-manager.abstract';
import {Tweet} from '../../_models/Tweet';
import {MapModes} from '../../_models/MapModes';

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
    this.mapMode = MapModes.Scotland;
    this.allowRegionPulsing = false;
    this.apiDataRoute = 'all_scotland_district_data';

    this.loadDistrictsData();

    this.listenOnSockets();
  }

  protected listenOnSockets(): void {
    this._tweet.getScotlandDistrictTweets().subscribe((msg: Tweet) => this.updateLastTweet(msg, msg.ward));
  }
}
