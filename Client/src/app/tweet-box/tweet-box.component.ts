import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {District} from '../_models/District';
import {Tweet} from '../_models/Tweet';
import {DataManagerService} from '../_services';

declare let d3: any;

@Component({
  selector: 'app-tweet-box',
  templateUrl: './tweet-box.component.html',
  styleUrls: ['./tweet-box.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TweetBoxComponent implements OnInit, OnChanges {
  @Input() ward: District;

  private colour: any;
  private pauseButtonLabels = {
    'true': 'Pause Live Feed <i class="fas fa-pause" style="margin-left: 5px;"></i>',
    'false': 'Resume Live Feed <i class="fas fa-play" style="margin-left: 5px;"></i>'
  };

  public liveTweets = true;

  constructor(private _dataManager: DataManagerService) {
    this.colour = d3.scale.linear()
      .domain([0, 50, 100])
      .range(['#ff000c', /*'#8f8f8f',*/ '#b2b2b2', '#0500ff']);
  }

  public ngOnInit() {
  }

  public get pauseButtonText() {
    return this.pauseButtonLabels[this.liveTweets.toString()];
  }

  public trackByFn(index, tweet: Tweet) {
    return tweet.id;
  }

  public toggleLiveTweets() {
    this.liveTweets = !this.liveTweets;
    this._dataManager.setUpdateTweets(this.liveTweets);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['ward']) {
      // console.log(this.ward);
    }
  }

  public getTweetBorder(score: number): string {
    return '2px solid ' + this.colour(score);
  }

  public getTweetColour(score: number): string {
    return this.colour(score);
  }
}
