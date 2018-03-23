import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
declare let d3: any;
import * as wordCloud from 'd3-cloud';
import {DataManagerService} from '../_services';
import {Tweet} from '../_models/Tweet';
import {District} from '../_models/District';
import {Colour} from '../_models/Colour';

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

  constructor(private _dataManager: DataManagerService) { }

  ngAfterViewInit() {
    this._dataManager.getLatestTweet().subscribe((tweet: Tweet) => {
      // console.log("word cloud tweet", tweet);
    });

    this._dataManager.getDistrict().subscribe((district: District) => {
      this.district = district;

      this.generateLayout();
    });

    this.svg = d3.select('#wordcloud').append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 ' + 1000 + ' ' + 500)
      .append('g')
      .attr('transform', 'translate(500,250)');
  }

  public generateLayout() {
    if (this.district.common_emote_words && this.district.common_emote_words.length > 0) {
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
