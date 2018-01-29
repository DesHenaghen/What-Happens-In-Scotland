import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';

declare let d3: any;
import 'nvd3';
import {District} from '../_models/District';

/**
 * Component for the generation of a line chart to show happiness over time for a ward
 */
@Component({
  selector: 'app-happy-timeline',
  templateUrl: './happy-timeline.component.html',
  styleUrls: [
    './happy-timeline.component.css',
    // include original nvd3 styles
    '../../../node_modules/nvd3/build/nv.d3.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class HappyTimelineComponent implements OnInit, OnChanges {

  @Input() ward: District;

  public lineOptions: any;
  public lineData: any[];

  constructor() { }

  public ngOnInit(): void {
    this.setOptions();
  }

  /**
   * Reacts to the change of any @Input variables
   * @param {SimpleChanges} changes
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['ward']) {
      this.setData();
    }
  }

  /**
   * Sets the options for the happy timeline line chart
   */
  private setOptions(): void {
    this.lineOptions = {
      chart: {
        type: 'lineChart',
        yDomain: [-1, 1],
        height: 250,
        margin : {
          top: 20,
          right: 20,
          bottom: 40,
          left: 55
        },
        useInteractiveGuideline: true,
        xAxis: {
          axisLabel: 'Date',
          tickFormat: d =>  d3.time.format('%b %d')(new Date(d))
        },
        yAxis: {
          axisLabel: 'Happiness',
          tickFormat: d => d,
          axisLabelDistance: -10
        }
      }
    };
  }

  /**
   * Sets the data for the happy timeline line chart
   */
  private setData (): void {
    if (this.ward.values) {
      // Line chart data should be sent as an array of series objects.
      this.lineData = [
        {
          values: this.ward.values,
          key: 'Happiness',
          color: '#7cff6c',
          area: true      // area - set to true if you want this line to turn into a filled area chart.
        }
      ];
    }
  }

}
