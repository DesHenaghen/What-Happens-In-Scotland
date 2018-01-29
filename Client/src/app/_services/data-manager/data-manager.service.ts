import { Injectable } from '@angular/core';
import {DataManagerInterface} from '../../_interfaces/data-manager.interface';
import {Observable} from 'rxjs/Observable';
import {District} from '../../_models/District';
import {Tweet} from '../../_models/Tweet';
import {FeatureCollection} from 'geojson';
import {GlasgowDataManagerService} from '../glasgow-data-manager/glasgow-data-manager.service';
import {ScotlandDataManagerService} from '../scotland-data-manager/scotland-data-manager.service';

@Injectable()
export class DataManagerService implements DataManagerInterface {

  private _dataManager: DataManagerInterface;

  constructor(
    private _glasgowDataManager: GlasgowDataManagerService,
    private _scotlandDataManager: ScotlandDataManagerService
  ) {
    this._dataManager = _scotlandDataManager;
    // this._dataManager = _glasgowDataManager;
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
