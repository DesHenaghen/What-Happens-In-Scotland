import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TweetService, DataManagerService} from '../_services';
import {District} from '../_models/District';
import {MatTabChangeEvent} from '@angular/material';

export enum MapModes {
  Scotland=0,
  Glasgow=1
}

/**
 * The base component for the home screen. Manages the styling of the page as well as the loading and modification
 * of wards data.
 */
@Component({
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  public district: District;
  public districts: {[id: string]: District};

  public mapModes = MapModes;
  public currentMode: MapModes;

  constructor(
    private _http: HttpClient,
    private _tweet: TweetService,
    private _dataManager: DataManagerService
  ) { }

  public ngOnInit(): void {
    this.currentMode = MapModes.Scotland;

    this._dataManager.getDistrict().subscribe((district: District) => {
      this.district = district;
      this.setStyling(district.id);
    });
    this._dataManager.getDistricts().subscribe((districts: {[id: string]: District}) => this.districts = districts);
  }

  /**
   * Sets the css styling based on which ward is selected.
   * @param {string} area - id of the selected ward
   */
  private setStyling(area: string): void {
    if (area !== undefined) {
      this.clearSelectedClass();
      document.getElementById(area).classList.add('selected');
    }
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    this.currentMode = tabChangeEvent.index;
  }

  /**
   * Removes the selected class from all wards drawn on the map
   */
  private clearSelectedClass(): void {
    for (const [key] of Object.entries(this.districts)) {
      document.getElementById(key).classList.remove('selected');
    }
  }

}

