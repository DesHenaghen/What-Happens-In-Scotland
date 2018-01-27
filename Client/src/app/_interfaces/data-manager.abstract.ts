import { Injector } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { forkJoin } from 'rxjs/observable/forkJoin';

import {DataService} from '../_services/data.service';
import {TweetService} from '../_services/tweet.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

declare let d3: any;

/**
 *
 */
export abstract class DataManagerInterface {
  // Services
  protected _http: HttpClient;
  protected _dataService: DataService;
  protected _tweet: TweetService;

  // Fields
  // TODO: Replace any with models
  protected district = new BehaviorSubject<any>({last_tweet: {text: 'n/a', user: {name: 'n/a/'}}});
  // TODO: Replace any with models
  protected districts = {};
  protected districtsSubject = new BehaviorSubject<any>(undefined);
  // TODO: Replace any with models
  protected latestTweet = new BehaviorSubject<any>(undefined);
  // TODO: Replace any with models
  protected mapTopology = new BehaviorSubject<any>(undefined);


  // Map identifiers
  protected regionName: string;
  protected mapType: string;
  protected dataFile: string;

  // GeoJSON data keys
  protected topologyId: string;
  protected topologyName: string;


  constructor(injector: Injector) {
    this._http = injector.get(HttpClient);
    this._dataService = injector.get(DataService);
    this._tweet = injector.get(TweetService);
  }

  public getDistrict(): Observable<any> {
    return this.district.asObservable();
  }

  public getDistricts(): Observable<any> {
    return this.districtsSubject.asObservable();
  }

  public getLatestTweet(): Observable<any> {
    return this.latestTweet.asObservable();
  }

  public getMapTopology(): Observable<any> {
    return this.mapTopology.asObservable();
  }

  public updateLastTweet(tweet, id) {
    tweet.id = id;
    const district = this.districts[id];
    let sum = district.average * district.totals[district.totals.length - 1];
    sum += tweet.score;

    district.total++;
    district.totals[district.totals.length - 1]++;
    district.average = sum / district.totals[district.totals.length - 1];
    district.values[district.values.length - 1].y = district.average;
    district.prettyAverage = Math.round(district.average * 10) / 10;
    district.last_tweet = tweet;

    this.districts[id] = district;

    this.districtsSubject.next(this.districts);
    this.latestTweet.next(tweet);
  }

  /**
   * Loads the districts from a JSON file. Generates data for these districts and passes this data
   * to the child map component.
   */
  public loadDistrictsData(): void {
    // d3.json('./assets/json/glasgow-districts.json', (error, topology) => {
    d3.json('./assets/json/' + this.dataFile, (error, topology) => {
      if (error) {
        console.error(error);
      } else {
        const httpRequests = [];
        const httpRequestIds: string[] = [];

        // Extract data for each district
        topology.features.forEach(feature => {
          const id = feature.properties[this.topologyId];

          this.districts[feature.properties[this.topologyId]] = {
            name: feature.properties[this.topologyName],
            id
          };
          httpRequests.push(this._dataService.getWardData(id));
          httpRequestIds.push(id);
        });

        // All of glasgow data
        this.districts[this.mapType + '-boundary'] = { name: this.regionName, id: this.mapType + '-boundary'};
        httpRequests.push(this._dataService.getGlasgowData());
        httpRequestIds.push(this.mapType + '-boundary');

        // Assign all the values from the http requests
        forkJoin(httpRequests).subscribe(
          (wardValues: any) => {
            for (let i = 0; i < wardValues.length; i++) {
              console.log(wardValues[i]);
              const values: any = wardValues[i].values;
              const id = httpRequestIds[i];

              this.districts[id].values = values;
              this.districts[id].average = (values.length > 0) ? values[values.length - 1].y : 0;
              this.districts[id].prettyAverage = Math.round(this.districts[id].average * 10) / 10;
              this.districts[id].total = wardValues[i].total;
              this.districts[id].totals = wardValues[i].totals;
              this.districts[id].last_tweet = (wardValues[i].last_tweet) ?
                wardValues[i].last_tweet :
                {text: 'n/a', user: {name: 'n/a'}};
            }
          },
          err => {
            console.error(err);
            // console.log('Trying to load data again.');
            // this.loadWardsData();
          },
          () => {
            this.districtsSubject.next(this.districts);
            this.mapTopology.next(topology);
            this.setDistrict(this.mapType + '-boundary');
          });

      }
    });
  }

  /**
   * Sets the district as selected. Called by the child components.
   * @param {string} area - id of the selected district
   */
  public setDistrict(area: string): void {
    this.district.next(this.districts[area]);
  }

  protected abstract listenOnSockets();
}

