import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
declare let d3: any;
import * as wordCloud from 'd3-cloud';
import {DataManagerService} from '../_services';
import {Tweet} from '../_models/Tweet';
import {District} from '../_models/District';
import {Colour} from '../_models/Colour';
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-word-cloud',
  templateUrl: './word-cloud.component.html',
  styleUrls: ['./word-cloud.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WordCloudComponent implements AfterViewInit {

  private layout: any;
  private svg: any;
  private district: District;
  private districtSubscription: Subscription = new Subscription();

  constructor(private _dataManager: DataManagerService) { }

  ngAfterViewInit() {
    this.svg = d3.select('#wordcloud').append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 ' + 500 + ' ' + 500)
      .append('g')
      .attr('transform', 'translate(250,250)');

    this._dataManager.getDataManager().subscribe(dm => {
      if (dm !== undefined) {
        this.subscribeForDistrictData();
      }
    });
  }

  public subscribeForDistrictData() {
    if (!this.districtSubscription.closed) {
      this.districtSubscription.unsubscribe();
    }
    this.districtSubscription = this._dataManager.getDistrict().subscribe((district: District) => {
      console.log(district);
      this.district = district;

      this.generateLayout();
    });
  }

  public generateLayout() {
    if (this.district.common_emote_words) {
      const words = this.district.common_emote_words.slice(0, 30);
      let max;
      this.layout = wordCloud()
        .size([500, 500])
        .words(words.map(d => {
          const values = d.split(', ');
          const totalUses = parseFloat(values[2]);
          if (max === undefined || totalUses > max) max = totalUses;
          return {text: values[0], size: totalUses, test: 'haha', value2: values[1], value: ((parseFloat(values[1]) + 4) / 8 * 100)};
        }))
        .padding(5)
        .font('Impact')
        .fontSize(d => 90 * d.size / max)
        .on('end', this.drawWordCloud);

      this.layout.start();
    } else {
      this.drawWordCloud([]);
    }
  }

  public drawWordCloud = (words) => {
    const cloud = this.svg.selectAll('g text')
      .data(words, d => d.text);

    // Entering words
    cloud.enter()
      .append('text')
      .style('font-family', 'Impact')
      .style('fill', d => Colour.getColour(d.value))
      .attr('text-anchor', 'middle')
      .attr('font-size', 1)
      .text(d => d.text);

    // Entering and existing words
    cloud
      .transition()
      .duration(600)
      .style('font-size', d => d.size + 'px')
      .attr('transform', d =>  'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')')
      .style('fill-opacity', 1);

    // Exiting words
    cloud.exit()
      .transition()
      .duration(200)
      .style('fill-opacity', 1e-6)
      .attr('font-size', 1)
      .remove();
  }


}
