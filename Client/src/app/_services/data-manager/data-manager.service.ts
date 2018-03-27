import { Injectable } from '@angular/core';
import {DataManagerInterface} from '../../_interfaces/data-manager.interface';
import {Observable} from 'rxjs/Observable';
import {District} from '../../_models/District';
import {Tweet} from '../../_models/Tweet';
import {FeatureCollection} from 'geojson';
import {GlasgowDataManagerService} from '../glasgow-data-manager/glasgow-data-manager.service';
import {ScotlandDataManagerService} from '../scotland-data-manager/scotland-data-manager.service';
import {MapModes} from '../../_models/MapModes';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {EdinburghDataManagerService} from '../edinburgh-data-manager/edinburgh-data-manager.service';
import * as moment from 'moment';


@Injectable()
export class DataManagerService implements DataManagerInterface {
  allowRegionPulsing: boolean;
  regionName: string;
  mapType: string;
  dataFile: string;
  public get districtId(): string {
    return this._dataManager.districtId;
  }
  topologyId: string;
  topologyName: string;
  public get mapMode(): MapModes {
    return this._dataManager.mapMode;
  }

  private _dataManager: DataManagerInterface;
  private _dataManagerSubject = new BehaviorSubject<DataManagerInterface>(this._dataManager);

  private _dataManagers: {[id: number]: DataManagerInterface} = {};


  constructor(
    private _glasgowDataManager: GlasgowDataManagerService,
    private _scotlandDataManager: ScotlandDataManagerService,
    private _edinburghDataManager: EdinburghDataManagerService
  ) {
    this._dataManagers[MapModes.Scotland] = _scotlandDataManager;
    this._dataManagers[MapModes.Glasgow] = _glasgowDataManager;
    this._dataManagers[MapModes.Edinburgh] = _edinburghDataManager;

    this._dataManager = this._dataManagers[MapModes.Scotland];
    this._dataManagerSubject.next(this._dataManager);
  }

  /**
   * Sets the current MapMode(State)
   * @param {number} mode - Enum value of MapModes
   */
  public selectDataManager(mode: number) {
    this._dataManager = this._dataManagers[mode];
    this._dataManagerSubject.next(this._dataManager);
  }

  getDistrict(): Observable<District> {
    return this._dataManager.getDistrict();
  }

  getDistricts(): Observable<{ [id: string]: District }> {
    return this._dataManager.getDistricts();
  }

  getLatestTweet(): Observable<Tweet> {
    return this._dataManager.getLatestTweet();
  }

  getMapTopology(): Observable<FeatureCollection<any>> {
    return this._dataManager.getMapTopology();
  }

  getDataManager(): Observable<DataManagerInterface> {
    return this._dataManagerSubject.asObservable();
  }

  getLoadedData(): Observable<boolean> {
    return this._dataManager.getLoadedData();
  }

  updateLastTweet(tweet: Tweet, id: string): void {
    this._dataManager.updateLastTweet(tweet, id);
  }

  loadDistrictsData(): void {
    this._dataManager.loadDistrictsData();
  }

  getTweets(): Observable<{[id: string]: Tweet[]}> {
    return this._dataManager.getTweets();
  }

  fetchDistrictTweets(date: moment.Moment, append: boolean) {
    this._dataManager.fetchDistrictTweets(date, append);
  }

  highlightEmotiveWords(word: string, tweet: Tweet, new_words: string[], new_scores: number[]) {
    return this._dataManager.highlightEmotiveWords(word, tweet, new_words, new_scores);
  }

  refreshAllDistrictsData(date: Date, period: number): void {
    for (const i in this._dataManagers) {
      if (this._dataManagers.hasOwnProperty(i)) {
        this._dataManagers[i].refreshAllDistrictsData(date, period);
      }
    }
  }

  setDistrict(area: string): void {
    this._dataManager.setDistrict(area);
  }

  getMapBoundaryId(): string {
    return this._dataManager.getMapBoundaryId();
  }

  public setUpdateTweets(bool: boolean) {
    this._dataManager.setUpdateTweets(bool);
  }

  setDistrictDataTime(index: number): void {
    this._dataManager.setDistrictDataTime(index);
  }

  setDistrictDataDates(): void {
    this._dataManager.setDistrictDataDates();
  }
}
