import {Injectable, Injector, OnInit} from '@angular/core';
import {DataManagerInterface} from '../_interfaces/data-manager.abstract';

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
    this._tweet.glasgow_tweets.subscribe(msg => this.updateLastTweet(msg, 'glasgow-boundary'));
    this._tweet.geo_tweets.subscribe(msg => this.updateLastTweet(msg, msg.ward));
  }
}
