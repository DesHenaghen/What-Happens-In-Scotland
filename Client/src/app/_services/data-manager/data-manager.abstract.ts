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
import {MapModes} from '../../_models/MapModes';

declare let d3: any;
import * as moment from 'moment';
import {Moment} from 'moment';

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
  protected loadedData = new BehaviorSubject<boolean>(false);

  // Map identifiers
  public regionName: string;
  public mapType: string;
  public dataFile: string;
  public districtId: string;
  public mapMode: MapModes;
  public allowRegionPulsing: boolean;
  protected apiDataRoute: string;

  // GeoJSON data keys
  public topologyId: string;
  public topologyName: string;

  private targetDate = moment();


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

  public getLoadedData(): Observable<boolean> {
    return this.loadedData.asObservable();
  }

  public getTweets(): Observable<{[id: string]: Tweet[]}> {
    return this._tweet.getTweets();
  }

  public getMapBoundaryId(): string {
    return this.mapType + '-boundary';
  }

  public updateLastTweet(tweet: Tweet, id: string): void {

    const new_scores = [];
    const new_words = [];

    // Highlight emotive words
    tweet.text = tweet.text.split(' ').map(word => this.highlightEmotiveWords(word, tweet, new_words, new_scores)).join(' ');
    tweet.text_sentiment_words = [...new_words, ...tweet.text_sentiment_words];
    tweet.text_sentiments = [...new_scores, ...tweet.text_sentiments];

    // If the tweet belongs to the whole map area, set the id accordingly
    id = (this.districtId === id) ? this.mapType + '-boundary' : id;

    tweet.id = id;
    const district = this.districts[id];
    const region = this.districts[this.mapType + '-boundary'];
    // console.log(this.districts);
    // console.log(this.regionName, tweet, id, district);

    // If the id isn't equivalent to the region, update it
    if (region && district && region !== district) {
      this.districts[this.mapType + '-boundary'] = this.updateDistrict(region, tweet);
    }

    // If id matched one of the map disticts, update it
    if (district) {
      this.districts[id] = this.updateDistrict(district, tweet);
    }

    // If the id matched the district or one of the regions, update the values
    if (region || district) {
      this.districtsSubject.next(this.districts);
      this.latestTweet.next(tweet);
    }
  }

  public highlightEmotiveWords(word, tweet, new_words, new_scores) {
    if (tweet.text_sentiment_words[0] && word.toLowerCase().startsWith(tweet.text_sentiment_words[0])) {
      new_words.push(tweet.text_sentiment_words.shift());
      const score = tweet.text_sentiments.shift();
      new_scores.push(score);

      if (score > 0 ) {
        word = '<span class="blue_text">' + word + '</span>';
      } else if (score < 0) {
        word = '<span class="red_text">' + word + '</span>';
      }

    }

    return word;
  }

  private updateDistrict(district: District, tweet: Tweet): District {
    let sum = district.average * district.totals[district.totals.length - 1];
    sum += tweet.score;

    tweet.date = new Date().toISOString();

    district.total++;
    district.totals[district.totals.length - 1]++;
    district.average = sum / district.totals[district.totals.length - 1];
    if (district.values && district.values.length > 0 && district.values[district.values.length - 1])
      district.values[district.values.length - 1].y = district.average;
    district.prettyAverage = Math.round(district.average * 10) / 10;

    if (district.last_tweets.length >= 10) {
      district.last_tweets.pop();
    }

    district.last_tweets.unshift(tweet);

    return district;
  }

  /**
   * Loads the districts from a JSON file. Generates data for these districts and passes this data
   * to the child map component.
   */
  public loadDistrictsData(): void {
    this.loadedData.next(false);
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

        // All of regions data
        areaIds.push(this.districtId);
        areaNames[this.districtId] = this.regionName;

        this.getDistrictsData(areaIds).subscribe(
          results => {
            for (let i = 0; i < areaIds.length; i++) {
              const id = areaIds[i];
              const wardData: AreaData = results[id];

              const values = wardData.values;
              const name = areaNames[id];
              const average = (values.length > 0) ? values[values.length - 1].y : 0;
              const prettyAverage = Math.round(average * 10) / 10;
              const common_emote_words = wardData.common_emote_words;
              const last_tweets: Tweet[] = (wardData.last_tweet) ?
                [wardData.last_tweet] :
                [];

              const districtId = (id === this.districtId) ? this.getMapBoundaryId() : id;
              this.districts[districtId] = {
                id,
                name,
                values,
                average,
                prettyAverage,
                common_emote_words,
                last_tweets,
                total: wardData.total,
                totals: wardData.totals
              };
            }
          },
          err => {
            console.error(err);
          },
          () => {
            this.loadedData.next(true);
            this.districtsSubject.next(this.districts);
            this.mapTopology.next(topology);
            this.setDistrict(this.mapType + '-boundary');
            this.fetchDistrictTweets(this.targetDate, false);
          }
        );
      }
    });
  }

  public fetchDistrictTweets(date: moment.Moment, append: boolean) {
    if (this.mapMode === MapModes.Scotland) {
      this.getDistrictsTweets(date).subscribe(
        results => {
          // results.map(t => t.date = new Date(t.date));
          this._tweet.setTweets(results, date, append);
        }
      );
    }
  }

  public refreshAllDistrictsData(date: Date, period: number) {
    this.targetDate = moment(date);
    this.loadedData.next(false);
    const areaIds: string[] = [];
    const areaNames: {[id: string]: string} = {};

    for (const [key, value] of Object.entries(this.districts)) {
      if (key !== this.getMapBoundaryId()) {
        areaIds.push(key);
        areaNames[key] = value.name;
      }
    }

    areaIds.push(this.districtId);
    areaNames[this.districtId] = this.regionName;

    this.getDistrictsData(areaIds, date, period).subscribe(
      results => {
        for (let i = 0; i < areaIds.length; i++) {
          const id = areaIds[i];
          const wardData: AreaData = results[id];

          const values = wardData.values;
          const name = areaNames[id];
          const average = (values.length > 0) ? values[values.length - 1].y : 0;
          const prettyAverage = Math.round(average * 10) / 10;
          const common_emote_words = wardData.common_emote_words;
          const last_tweets: Tweet[] = (wardData.last_tweet) ?
            [wardData.last_tweet] :
            [];

          const districtId = (id === this.districtId) ? this.getMapBoundaryId() : id;
          this.districts[districtId] = {
            id,
            name,
            values,
            average,
            prettyAverage,
            common_emote_words,
            last_tweets,
            total: wardData.total,
            totals: wardData.totals
          };
        }
      },
      err => {
        console.error(err);
      },
      () => {
        this.loadedData.next(true);
        this.districtsSubject.next(this.districts);
        this.setDistrict(this.mapType + '-boundary');
        this.fetchDistrictTweets(this.targetDate, false);
      }
    );
  }

  /**
   * Sets the district as selected. Called by the child components.
   * @param {string} area - id of the selected district
   */
  public setDistrict(area: string): void {
    this.district.next(this.districts[area]);
  }

  protected getDistrictsData(ids: string[], date: Date = new Date(), period: number = 3) {
    const dateString: string = moment(date).format('YYYY-MM-DD');
    return this._http.get<any>('/api/' + this.apiDataRoute, {
      params: {ids, region: 'true', date: dateString, period: '' + period}
    });
  }

  protected getDistrictsTweets(date: moment.Moment) {
    return this._http.get<any>('/api/districts_tweets', {
      params: {date: date.format('YYYY-MM-DD')}
    });
  }

  protected abstract listenOnSockets(): void;
}

