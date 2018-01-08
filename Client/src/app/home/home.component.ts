import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {GlasgowMapComponent} from '../glasgow-map/glasgow-map.component';
import {DataService} from '../data.service';

declare let d3: any;
import * as moment from 'moment';
import {HttpClient} from '@angular/common/http';

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
    this.loadWards();
  }

  /**
   * Loads the wards from a JSON file. Generates data for these wards and passes this data
   * to the child map component.
   */
  private loadWards(): void {
    // this._dataService.getWards().subscribe(
    //   topology => {
    //     topology.features.forEach(feature => {
    //       this.wards[feature.properties.WD13CD] = { name: feature.properties.WD13NM };
    //       this.generateData(feature.properties.WD13CD);
    //     });
    //
    //     this.wards['glasgow-boundary'] = { name: 'Glasgow' };
    //     this.generateData(null, topology);
    //   }
    // );

    d3.json('./assets/json/glasgow-wards.json', (error, topology) => {
      if (error) {
        console.error(error);
      } else {
        topology.features.forEach(feature => {
          this.wards[feature.properties.WD13CD] = { name: feature.properties.WD13NM };
          this.generateData(feature.properties.WD13CD);
        });

        this.wards['glasgow-boundary'] = { name: 'Glasgow' };
        this.generateData(null, topology);
      }
    });
  }

  /**
   * Generates data for the ward with the provided id.
   * @param {string} selectedArea - the id of the ward
   * @param topology
   * @returns {any[]} - the values generated for the ward
   */
  private generateData (selectedArea?: string, topology?: any) {
    const area = selectedArea || 'glasgow-boundary';

    this._dataService.getData().subscribe(
values => {
        this.wards[area].values = values;
        this.wards[area].average = (values.reduce((a, b) => ({y: a.y + b.y})).y / values.length);
        this.wards[area].prettyAverage = Math.round(this.wards[area].average * 100);

        if (!selectedArea) {
          // Set values for and draw map of Glasgow
          this.map.wards = this.wards;
          this.map.drawMap(topology);

          this.setWard('glasgow-boundary');
        }
      },
err => console.error(err),
() => console.log('done loading data')
    );
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
    document.getElementById('chart-box').style.backgroundColor = this.map.colour(this.wards[area].average);
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

