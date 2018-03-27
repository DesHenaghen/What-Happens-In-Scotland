import {AfterViewInit, Component, ViewEncapsulation} from '@angular/core';
declare let d3: any;
import * as wordCloud from 'd3-cloud';
import {DataManagerService} from '../_services';
import {Tweet} from '../_models/Tweet';
import {District} from '../_models/District';
import {Colour} from '../_models/Colour';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-word-cloud',
  templateUrl: './word-cloud.component.html',
  styleUrls: ['./word-cloud.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WordCloudComponent implements AfterViewInit {

  private layout: any;
  private svg: any;
  public district: District;
  private districtSubscription: Subscription = new Subscription();
  private districtTimeSubscription: Subscription = new Subscription();
  private tweetSubscription: Subscription = new Subscription();
  private tweetCount = 10;

  constructor(public _dataManager: DataManagerService) { }

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
    if (!this.tweetSubscription.closed) {
      this.tweetSubscription.unsubscribe();
    }
    this.tweetSubscription = this._dataManager.getLatestTweet().subscribe((tweet: Tweet) => {
      if (this.district) {
        if (this.tweetCount === 0) {
          this.generateLayout();
          this.tweetCount = 10;
        }

        this.tweetCount--;
      }
    });

    if (!this.districtSubscription.closed) {
      this.districtSubscription.unsubscribe();
    }
    this.districtSubscription = this._dataManager.getDistrict().subscribe((district: District) => {
      this.district = district;

      this.generateLayout();
    });

    if (!this.districtTimeSubscription.closed) {
      this.districtTimeSubscription.unsubscribe();
    }
    this.districtTimeSubscription = this._dataManager.isDistrictTimeChanged().subscribe(() => {
      this.generateLayout();
    });
  }

  public generateLayout() {
    if (this.district.currentWords) {
      let max;
      this.layout = wordCloud()
        .size([500, 500])
        .words(Object.values(this.district.currentWords)
          .sort((a, b) => b.freq - a.freq)
          .slice(0, 30)
          .map(d => {
            if (max === undefined || d.freq > max) max = d.freq;
            return {text: d.word, size: d.freq, value: d.score};
          })
        )
        .padding(5)
        .font('Impact')
        .fontSize(d => {
          const size = 90 * d.size / max;
          if (size > 5) return size;
        })
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
