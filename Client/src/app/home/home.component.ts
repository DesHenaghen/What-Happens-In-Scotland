import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { forkJoin } from 'rxjs/observable/forkJoin';

import {GlasgowMapComponent} from '../glasgow-map/glasgow-map.component';
import {DataService} from '../data.service';

declare let d3: any;

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
  /* */
  public ward: any = {};
  public wards = {};

  // Reference to the child GlasgowMapComponent
  @ViewChild(GlasgowMapComponent) map;

  constructor(
    private _http: HttpClient,
    private _dataService: DataService
  ) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.loadWardsData();
  }

  /**
   * Loads the wards from a JSON file. Generates data for these wards and passes this data
   * to the child map component.
   */
  private loadWardsData(): void {
    d3.json('./assets/json/glasgow-wards.json', (error, topology) => {
      if (error) {
        console.error(error);
      } else {
        const httpRequests = [];
        const httpRequestIds: string[] = [];

        // Extract data for each ward
        topology.features.forEach(feature => {
          this.wards[feature.properties.WD13CD] = { name: feature.properties.WD13NM };
          httpRequests.push(this._dataService.getWardData(feature.properties.WD13CD));
          httpRequestIds.push(feature.properties.WD13CD);
        });

        // All of glasgow data
        this.wards['glasgow-boundary'] = { name: 'Glasgow' };
        httpRequests.push(this._dataService.getGlasgowData());
        httpRequestIds.push('glasgow-boundary');

        // Assign all the values from the http requests
        forkJoin(httpRequests).subscribe(
          (wardValues: any) => {
            for (let i = 0; i < wardValues.length; i++) {
              console.log(wardValues[i]);
              const values: any = wardValues[i].values;
              const total: number = wardValues[i].total;
              const id = httpRequestIds[i];

              this.wards[id].values = values;
              this.wards[id].average = values[values.length - 1].y;
              this.wards[id].prettyAverage = Math.round(this.wards[id].average * 10) / 10;
              this.wards[id].total = total;
            }
          },
          err => {
            console.error(err);
            console.log('Trying to load data again.');
            this.loadWardsData();
          },
          () => {
            // Set values for and draw map of Glasgow
            this.map.wards = this.wards;
            this.map.drawMap(topology);

            this.setWard('glasgow-boundary');
          });

      }
    });
  }

  /**
   * Sets the ward as selected. Called by the child components.
   * @param {string} area - id of the selected ward
   */
  public setWard(area: string): void {
    this.ward = this.wards[area];

    this.setStyling(area);
  }

  /**
   * Sets the css styling based on which ward is selected.
   * @param {string} area - id of the selected ward
   */
  private setStyling(area: string): void {
    this.clearSelectedClass();
    // document.getElementById('chart-box').style.backgroundColor = this.map.colour(this.wards[area].average);
    document.getElementById(area).classList.add('selected');
  }

  /**
   * Removes the selected class from all wards drawn on the map
   */
  private clearSelectedClass(): void {
    for (const [key] of Object.entries(this.wards)) {
      document.getElementById(key).classList.remove('selected');
    }
  }

}

