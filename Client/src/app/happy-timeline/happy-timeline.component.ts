import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';

declare let d3: any;
import 'nvd3';

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

  @Input() ward: any;

  public lineOptions: any;
  public lineData: any[];

  constructor() { }

  ngOnInit() {
    this.setOptions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ward']) {
      this.setData();
    }
  }

  private setOptions(): void {
    this.lineOptions = {
      chart: {
        type: 'lineChart',
        yDomain: [0, 1],
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
          tickFormat: d => d3.time.format('%b %d')(new Date(d))
        },
        yAxis: {
          axisLabel: 'Happiness',
          tickFormat: d => Math.trunc(d * 100) + '%',
          axisLabelDistance: -10
        }
      }
    };
  }

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
