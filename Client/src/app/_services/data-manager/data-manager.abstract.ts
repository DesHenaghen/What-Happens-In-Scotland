import { Injector } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {TweetService} from '../tweet/tweet.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {District} from '../../_models/District';
import {AreaData} from '../../_models/AreaData';
import {Tweet} from '../../_models/Tweet';
import {Feature, FeatureCollection} from 'geojson';
import {DataManagerInterface} from '../../_interfaces/data-manager.interface';

declare let d3: any;

/**
 *
 */
export abstract class AbstractDataManager implements DataManagerInterface {
  // Services
  protected _http: HttpClient;
  protected _tweet: TweetService;

  // Fields
  protected district = new BehaviorSubject<District>(new District());
  protected districts: {[id: string]: District} = {};
  protected districtsSubject = new BehaviorSubject<{[id: string]: District}>(undefined);
  protected latestTweet = new BehaviorSubject<Tweet>(undefined);
  protected mapTopology = new BehaviorSubject<FeatureCollection<any>>(undefined);

  // Map identifiers
  protected regionName: string;
  protected mapType: string;
  protected dataFile: string;

  // GeoJSON data keys
  protected topologyId: string;
  protected topologyName: string;


  constructor(injector: Injector) {
    this._http = injector.get(HttpClient);
    this._tweet = injector.get(TweetService);
  }

  public getDistrict(): Observable<District> {
    return this.district.asObservable();
  }

  public getDistricts(): Observable<{[id: string]: District}> {
    return this.districtsSubject.asObservable();
  }

  public getLatestTweet(): Observable<Tweet> {
    return this.latestTweet.asObservable();
  }

  public getMapTopology(): Observable<FeatureCollection<any>> {
    return this.mapTopology.asObservable();
  }

  public updateLastTweet(tweet: Tweet, id: string): void {
    tweet.id = id;
    const district = this.districts[id];
    const region = this.districts[this.mapType + '-boundary'];
    // console.log(this.districts);
    // console.log(this.regionName, tweet, id, district);
    if (region) {
      this.districts[this.mapType + '-boundary'] = this.updateDistrict(region, tweet);
    }

    if (district) {
      this.districts[id] = this.updateDistrict(district, tweet);
    }

    this.districtsSubject.next(this.districts);
    this.latestTweet.next(tweet);
  }

  private updateDistrict(district: District, tweet: Tweet): District {
    let sum = district.average * district.totals[district.totals.length - 1];
    sum += tweet.score;

    district.total++;
    district.totals[district.totals.length - 1]++;
    district.average = sum / district.totals[district.totals.length - 1];
    district.values[district.values.length - 1].y = district.average;
    district.prettyAverage = Math.round(district.average * 10) / 10;
    district.last_tweet = tweet;

    return district;
  }

  /**
   * Loads the districts from a JSON file. Generates data for these districts and passes this data
   * to the child map component.
   */
  public loadDistrictsData(): void {

    console.log(this.getDistrictData);
    console.log(this.getRegionData);
    // d3.json('./assets/json/glasgow-districts.json', (error, topology) => {
    d3.json('./assets/json/' + this.dataFile, (error, topology: FeatureCollection<any>) => {
      if (error) {
        console.error(error);
      } else {
        const areaIds: string[] = [];
        const areaNames: {[id: string]: string} = {};

        // Extract data for each district
        topology.features.forEach( (feature: Feature<any>) => {
          const id = feature.properties[this.topologyId];
          areaNames[id] = feature.properties[this.topologyName];
          areaIds.push(id);
        });

        // All of glasgow data
        areaIds.push(this.mapType + '-boundary');
        areaNames[this.mapType + '-boundary'] = this.regionName;

        this.getDistrictsData(areaIds).subscribe(
          results => {
            for (let i = 0; i < areaIds.length; i++) {
              const id = areaIds[i];
              const wardData: AreaData = results[id];
              const values = wardData.values;
              const name = areaNames[id];
              const average = (values.length > 0) ? values[values.length - 1].y : 0;
              const prettyAverage = Math.round(average * 10) / 10;
              const last_tweet: Tweet = (wardData.last_tweet) ?
                wardData.last_tweet :
                {text: 'n/a', user: {name: 'n/a'}};

              this.districts[id] = {
                id,
                name,
                values,
                average,
                prettyAverage,
                last_tweet,
                total: wardData.total,
                totals: wardData.totals
              };
            }
          },
          err => {
            console.error(err);
          },
          () => {
            this.districtsSubject.next(this.districts);
            this.mapTopology.next(topology);
            this.setDistrict(this.mapType + '-boundary');
          }
        );
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

  protected abstract getRegionData(): any;
  protected abstract getDistrictData(id: string): any;
  protected abstract getDistrictsData(ids: string[]): any;

  protected abstract listenOnSockets(): void;
}

