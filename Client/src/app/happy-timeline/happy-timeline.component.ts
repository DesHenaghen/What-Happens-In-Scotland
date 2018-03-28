import {
  Component, DoCheck, Input, KeyValueDiffers, OnChanges, OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

declare let d3: any;
import 'nvd3';
import {District} from '../_models/District';
import {Colour} from '../_models/Colour';
import {DataManagerService} from '../_services';

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
  private currentPointIndex: number;
  private selectAll = false;

  constructor(
    private _differs: KeyValueDiffers,
    private _dataManager: DataManagerService
  ) {
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
        lines: {
          dispatch: {
            elementClick: e => {
              this._dataManager.setDistrictDataTime(e[0].pointIndex);
              this.currentPointIndex = e[0].pointIndex;
              this.selectAll = false;
              this.highlightCurrentPoint();
            }
          }
        },
        type: 'lineChart',
        yDomain: [0, 100],
        height: 250,
        margin : {
          top: 20,
          right: 20,
          bottom: 40,
          left: 55
        },
        interactiveLayer: {
          tooltip: {
            contentGenerator: (d) => {
              return '<p><b>' + d3.time.format('%b %d, %I %p')(new Date(d.value)) + '</b></p>'
                + '<p><b>' + d.series[0].key + ':</b> '
                + d.series[0].value.toFixed(1) + '%</p>'
                + '<p><b>No. Tweets:</b> ' + this.ward.totals[d.index] + '</p>';
            }
          }
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
  }

  /**
   * Sets the data for the happy timeline line chart
   */
  private setData (): void {
    if (this.ward.values && this.ward.values.length > 0) {
      if (this.lineOptions) {
        this.lineOptions.chart.forceX = [this.ward.values[0].x - 3000000, this.ward.values[this.ward.values.length - 1].x + 6000000];
      }

      if (!this.currentPointIndex)
        this.currentPointIndex = this.ward.values.length - 1;

      // Line chart data should be sent as an array of series objects.
      this.lineData = [
        {
          values: this.ward.values,
          key: 'Positivity',
          color: Colour.getColour((this.ward.values[this.currentPointIndex]) ? this.ward.values[this.currentPointIndex].y : 50),
          area: true      // area - set to true if you want this line to turn into a filled area chart.
        }
      ];

      this.highlightCurrentPoint();
    }
  }

  public setDistrictDataDates(): void {
    this._dataManager.setDistrictDataDates();
    this.selectAll = true;
  }

  private highlightCurrentPoint(i?: number): void {
    const index = i || this.currentPointIndex;

    const points: any = document.querySelectorAll('.nvd3 .nv-groups .nv-point');
    for (i = 0; i < points.length; ++i) {
      if (points[i].classList.contains('nv-point-' + index) || this.selectAll) {
        points[i].style.stroke = Colour.getColour((this.ward.values[index].y >= 50) ? 100 : 0);
        points[i].style['stroke-width'] = '5px';
      } else {
        points[i].style.stroke = null;
        points[i].style['stroke-width'] = null;
      }
    }
  }
}
