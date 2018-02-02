import { Injectable } from '@angular/core';
import {DataManagerInterface} from '../../_interfaces/data-manager.interface';
import {Observable} from 'rxjs/Observable';
import {District} from '../../_models/District';
import {Tweet} from '../../_models/Tweet';
import {FeatureCollection} from 'geojson';
import {GlasgowDataManagerService} from '../glasgow-data-manager/glasgow-data-manager.service';
import {ScotlandDataManagerService} from '../scotland-data-manager/scotland-data-manager.service';
import {MapModes} from '../../_models/MapModes';
import {Data} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class DataManagerService implements DataManagerInterface {

  private _dataManager: DataManagerInterface;
  private _dataManagerSubject = new BehaviorSubject<DataManagerInterface>(this._dataManager);

  private _dataManagers: {[id: number]: DataManagerInterface} = {};


  constructor(
    private _glasgowDataManager: GlasgowDataManagerService,
    private _scotlandDataManager: ScotlandDataManagerService
  ) {
    this._dataManagers[MapModes.Scotland] = _scotlandDataManager;
    this._dataManagers[MapModes.Glasgow] = _glasgowDataManager;

    this._dataManager = this._dataManagers[MapModes.Scotland];
    this._dataManagerSubject.next(this._dataManager);
  }

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

  updateLastTweet(tweet: Tweet, id: string): void {
    this._dataManager.updateLastTweet(tweet, id);
  }

  loadDistrictsData(): void {
    this._dataManager.loadDistrictsData();
  }

  setDistrict(area: string): void {
    this._dataManager.setDistrict(area);
  }

}
