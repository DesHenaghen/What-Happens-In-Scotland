import {
  Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges,
  ViewEncapsulation
} from '@angular/core';

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
export class HappyRankComponent implements OnInit, OnChanges {

  @Input() ward: any;
  @Input() wards: any;

  // Emits the id of the ward selected on the chart to parent components
  @Output() wardSelected = new EventEmitter<string>();

  public barOptions: any;
  public barData: any[];

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
    this.barOptions = {
      chart: {
        discretebar: {
          dispatch: {
            elementClick: e => this.wardSelected.emit(e.data.id)
          }
        },
        type: 'discreteBarChart',
        yDomain: [0, 100],
        height: 300,
        margin : {
          top: 20,
          right: 20,
          bottom: 50,
          left: 55
        },
        x: d => d.label,
        y: d => d.value * 100,
        showValues: false,
        valueFormat: d => (d * 100).toFixed() + '%',
        duration: 500,
        xAxis: {
          axisLabel: 'Wards (Ranked)',
          tickFormat: (d, i) => (i === 0 || i === 20) ? d : ''
        },
        yAxis: {
          axisLabel: 'Happiness',
          axisLabelDistance: -10
        }
      }
    };
  }

  private setData(): void {
    const barData = [
      {
        key: 'Wards',
        values: []
      }
    ];
    for (const [key, ward] of Object.entries(this.wards)) {
      if (ward.average) {
        // Line chart data should be sent as an array of series objects.
        barData[0].values.push(
          {
            value: ward.average,
            id: key,
            label: ward.name,
            color: (this.ward === ward) ? '#7cff6c' : '#ffffff'
          }
        );
      }
    }

    barData[0].values.sort((a, b) => b.value - a.value);
    this.barData = barData;
  }

}
