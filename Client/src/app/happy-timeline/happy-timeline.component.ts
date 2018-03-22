import {
  Component, DoCheck, Input, KeyValueDiffers, OnChanges, OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

declare let d3: any;
import 'nvd3';
import {District} from '../_models/District';
import {Colour} from "../_models/Colour";

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
export class HappyTimelineComponent implements OnInit, OnChanges, DoCheck {

  @Input() ward: District;
  @ViewChild('timelineChart') chart;

  public lineOptions: any;
  public lineData: any[];

  private _differ: any;

  constructor(
    private _differs: KeyValueDiffers) {
    this._differ = this._differs.find({}).create();
  }

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

  ngDoCheck() {
    if (this._differ) {
      const changes = this._differ.diff(this.ward);
      if (changes) {
        this.pulsePoint();
        this.setData();
      }
    }
  }

  public refreshChart() {
    if (this.chart && this.chart.chart && this.chart.chart.update) {
      this.chart.chart.update();
    }
  }

  public pulsePoint() {
    const element: any = document.querySelector('.nvd3 .nv-groups .nv-point-' + (this.ward.values.length - 1));
    if (element) {
      if (element.style.animationName === 'pointPulsate') {
        element.style.animationName = 'pointPulsate2';
      } else {
        element.style.animationName = 'pointPulsate';
      }
    }
  }

  /**
   * Sets the options for the happy timeline line chart
   */
  private setOptions(): void {
    this.lineOptions = {
      chart: {
        type: 'lineChart',
        yDomain: [0, 100],
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
          staggerLabels: true,
          tickFormat: d =>  d3.time.format('%b %d, %I %p')(new Date(d))
        },
        yAxis: {
          axisLabel: 'Positivity',
          tickFormat: d => d.toFixed(1) + '%',
          axisLabelDistance: -10
        }
      }
    };

    if (this.ward.values && this.ward.values.length > 0)
      this.lineOptions.chart.forceX = [this.ward.values[0].x - 60, this.ward.values[this.ward.values.length - 1].x + 60];
  }

  /**
   * Sets the data for the happy timeline line chart
   */
  private setData (): void {
    if (this.ward.values && this.ward.values.length > 0) {
      if (this.lineOptions) {
        this.lineOptions.chart.forceX = [this.ward.values[0].x - 3000000, this.ward.values[this.ward.values.length - 1].x + 6000000];
      }

      // Line chart data should be sent as an array of series objects.
      this.lineData = [
        {
          values: this.ward.values,
          key: 'Positivity',
          color: Colour.getColour(this.ward.values[this.ward.values.length - 1].y),
          area: true      // area - set to true if you want this line to turn into a filled area chart.
        }
      ];

      const lastPoint: any = document.querySelector('.nvd3 .nv-groups .nv-point-' + (this.ward.values.length - 1));
      if (lastPoint) {
        lastPoint.style.stroke = Colour.getColour((this.ward.values[this.ward.values.length - 1].y >= 50) ? 100 : 0);
        lastPoint.style['stroke-width'] = '5px';
      }
    }
  }

}
