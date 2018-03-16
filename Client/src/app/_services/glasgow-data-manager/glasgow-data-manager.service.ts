import {Injectable, Injector} from '@angular/core';
import {AbstractDataManager} from '../data-manager/data-manager.abstract';
import {Tweet} from '../../_models/Tweet';
import {MapModes} from '../../_models/MapModes';

@Injectable()
export class GlasgowDataManagerService extends AbstractDataManager {

  constructor(injector: Injector) {
    super(injector);

    this.dataFile = 'glasgow-wards.json';
    this.topologyId = 'WD13CD';
    this.topologyName = 'WD13NM';
    this.mapType = 'glasgow';
    this.regionName = 'Glasgow';
    this.districtId = 'S12000046';
    this.mapMode = MapModes.Glasgow;
    this.allowRegionPulsing = true;
    this.apiDataRoute = 'all_scotland_ward_data';

    this.loadDistrictsData();

    this.listenOnSockets();
  }

  protected listenOnSockets(): void {
    this._tweet.getScotlandDistrictTweets().subscribe((msg: Tweet) => this.updateLastTweet(msg, msg.ward));
    this._tweet.getScotlandWardTweets().subscribe((msg: Tweet) => this.updateLastTweet(msg, msg.ward));
  }
}
