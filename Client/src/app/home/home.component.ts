import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TweetService, DataManagerService} from '../_services';
import {District} from '../_models/District';
import {MatTabChangeEvent, MatTabGroup} from '@angular/material';
import {MapModes} from '../_models/MapModes';
import {Subscription} from 'rxjs/Subscription';

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

  @ViewChild('mapModeTabs') mapModeTabs: MatTabGroup;

  public district: District = new District();
  public districts: {[id: string]: District} = {};

  public mapModes = MapModes;
  public currentMode: MapModes;

  private districtSubscription: Subscription = new Subscription();
  private districtsSubscription: Subscription = new Subscription();

  constructor(
    private _http: HttpClient,
    private _tweet: TweetService,
    private _dataManager: DataManagerService
  ) { }

  public ngOnInit(): void {
    this.currentMode = MapModes.Scotland;

    this._dataManager.getDataManager().subscribe(dm => {
      if (dm !== undefined) {
        this.subscribeForDistrictData();
      }
    });
  }

  private subscribeForDistrictData(): void {

    // Manage District Subscription
    if (!this.districtSubscription.closed) {
      this.districtSubscription.unsubscribe();
    }
    this.districtSubscription = this._dataManager.getDistrict().subscribe((district: District) => {
      this.district = district;
      this.setStyling(district.id);
    });

    // Manage Districts Subscription
    if (!this.districtsSubscription.closed) {
      this.districtsSubscription.unsubscribe();
    }
    this.districtsSubscription = this._dataManager.getDistricts().subscribe(
      (districts: {[id: string]: District}) => this.districts = districts
    );
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

  public tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    this.setMode(tabChangeEvent.index);
  }

  public setMode(index: MapModes): void {
    this.mapModeTabs.selectedIndex = index;
    this.currentMode = index;
    this._dataManager.selectDataManager(this.currentMode);
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

