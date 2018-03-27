import {
  Component, DoCheck, Input, KeyValueDiffer, KeyValueDiffers, OnChanges, OnInit, SimpleChanges, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {DataManagerService} from '../_services';
import {District} from '../_models/District';
import {Colour} from "../_models/Colour";

/**
 * Component to generate and display a bar chart that shows how happiness ranks between wards
 */
@Component({
  selector: 'app-happy-rank',
  templateUrl: './happy-rank.component.html',
  styleUrls: [
    './happy-rank.component.css',
    // include original nvd3 styles
    '../../../node_modules/nvd3/build/nv.d3.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class HappyRankComponent implements OnInit, OnChanges, DoCheck {

  @Input() ward: District;
  @Input() wards: {[id: string]: District};
  @ViewChild('rankChart') chart;

  public barOptions: any = {};
  public barData: any[] = [];

  private _differ: any;
  public minValue: number;
  public maxValue: number;

  constructor(
    private _differs: KeyValueDiffers,
    private _dataManager: DataManagerService
  ) {
    this._differ = this._differs.find({}).create();
  }

  public ngOnInit(): void {
    this.setOptions();
  }

  public ngDoCheck(): void {
    if (this._differ) {
      if (this._differ.diff(this.wards) || this._differ.diff(this.ward)) {
        this.setData();
      }
    }
  }
  /**
   * Reacts to any changes to the @Input variables
   * @param {SimpleChanges} changes
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['ward'] || changes['wards']) {
      this.setData();
    }
  }

  public refreshChart() {
    if (this.chart && this.chart.chart) {
      this.chart.chart.update();
    }
  }

  /**
   * Sets the options for the happy rank bar chart
   */
  private setOptions(): void {
    this.barOptions = {
      chart: {
        discretebar: {
          dispatch: {
            elementClick: e => this._dataManager.setDistrict(e.data.id)
          }
        },
        useInteractiveGuideline: true,
        type: 'discreteBarChart',
        yDomain: [0, 100],
        height: 250,
        margin : {
          top: 20,
          right: 20,
          bottom: 50,
          left: 55
        },
        x: d => d.label,
        y: d => d.value,
        showValues: true,
        valueFormat: d => /*(d === this.minValue || d === this.maxValue) ? d.toFixed(0) + '%' : */'' ,
        duration: 250,
        wrapLabels: true,
        xAxis: {
          axisLabel: 'Wards (Ranked)',
          tickFormat: (d, i) => (i === 0 || i === this.barData[0].values.length) ? d : ''
        },
        yAxis: {
          axisLabel: 'Positivity',
          tickFormat: d => d.toFixed(0) + '%',
          axisLabelDistance: -10
        }
      }
    };
  }

  /**
   * Sets the data for the happy rank bar chart
   */
  private setData(): void {
    const barData = [
      {
        key: 'Wards',
        values: []
      }
    ];
    if (this.wards !== undefined) {
      for (const [key, ward] of Object.entries(this.wards)) {
        if ('average' in ward) {
          // Line chart data should be sent as an array of series objects.
          if (!this.minValue || ward.average < this.minValue) this.minValue = ward.average;
          if (!this.maxValue || ward.average > this.maxValue) this.maxValue = ward.average;
          barData[0].values.push(
            {
              value: ward.average,
              id: key,
              label: ward.name,
              color: this.getBarColour(key, ward)
            }
          );
        }
      }
    }

    barData[0].values.sort((a, b) => b.value - a.value);
    this.barData = barData;
    if (this.barOptions.chart)
      this.barOptions.chart.xAxis.tickFormat = (d, i) => (i === 0 || i === barData[0].values.length - 1) ? d : '';
  }

  private getBarColour(key, ward) {
    if (this.ward === ward)
      return '#8cff7d';
    else if (key === this._dataManager.getMapBoundaryId())
      return '#14be00';
    else
      return Colour.getColour(ward.average);
  }

}
