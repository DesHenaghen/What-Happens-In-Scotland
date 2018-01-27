import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DataService, GlasgowDataManagerService, TweetService} from '../_services';

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
export class HomeComponent implements OnInit, AfterViewInit {

  public district: any;
  public districts: any;

  constructor(
    private _http: HttpClient,
    private _dataService: DataService,
    private _tweet: TweetService,
    private _glasgowDataManager: GlasgowDataManagerService
  ) { }

  ngOnInit(): void {
    this._glasgowDataManager.getDistrict().subscribe(district => {
      this.district = district;
      this.setStyling(district.id);
    });
    this._glasgowDataManager.getDistricts().subscribe(districts => this.districts = districts);
  }

  ngAfterViewInit(): void {
    this._glasgowDataManager.loadDistrictsData();
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

  /**
   * Removes the selected class from all wards drawn on the map
   */
  private clearSelectedClass(): void {
    for (const [key] of Object.entries(this.districts)) {
      document.getElementById(key).classList.remove('selected');
    }
  }

}

