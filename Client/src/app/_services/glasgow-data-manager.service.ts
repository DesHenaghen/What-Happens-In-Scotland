import {Injectable, Injector} from '@angular/core';
import {DataManagerInterface} from '../_interfaces/data-manager.abstract';
import {Tweet} from '../_models/Tweet';

@Injectable()
export class GlasgowDataManagerService extends DataManagerInterface {

  constructor(injector: Injector) {
    super(injector);

    this.dataFile = 'glasgow-wards.json';
    this.topologyId = 'WD13CD';
    this.topologyName = 'WD13NM';
    this.mapType = 'glasgow';
    this.regionName = 'Glasgow';

    this.listenOnSockets();
  }

  protected listenOnSockets(): void {
    this._tweet.glasgow_tweets.subscribe((msg: Tweet) => this.updateLastTweet(msg, 'glasgow-boundary'));
    this._tweet.geo_tweets.subscribe((msg: Tweet) => this.updateLastTweet(msg, msg.ward));
  }
}
