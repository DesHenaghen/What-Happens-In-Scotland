import {
  AfterViewChecked, Component, DoCheck, Input, OnChanges, OnInit, SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {District} from '../_models/District';
import {Tweet} from '../_models/Tweet';
import {DataManagerService} from '../_services';
import {Colour} from '../_models/Colour';

declare let d3: any;

@Component({
  selector: 'app-tweet-box',
  templateUrl: './tweet-box.component.html',
  styleUrls: ['./tweet-box.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TweetBoxComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() ward: District;

  private colour: any;
  private pauseButtonLabels = {
    'true': 'Pause Live Feed <i class="fas fa-pause" style="margin-left: 5px;"></i>',
    'false': 'Resume Live Feed <i class="fas fa-play" style="margin-left: 5px;"></i>'
  };

  public liveTweets = true;
  private mostRecentTweet: Tweet;

  constructor(private _dataManager: DataManagerService) {
    this.colour = Colour.getColour;
  }

  public ngOnInit() {
  }

  ngAfterViewChecked(): void {
    const tweet = this.ward.last_tweets[0];
    if (this.mostRecentTweet !== tweet) {
      const listBox = document.querySelector('#tweet_box');
      if (listBox.scrollTop !== 0) {
        const latestTweet: any = document.querySelector('#T' + tweet.user.id + tweet.date.substring(tweet.date.length - 4));
        listBox.scrollTop += latestTweet.offsetHeight;
      }
      this.mostRecentTweet = tweet;
    }
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
      // console.log("changes - ward - tweet-box", this.ward);
    }
  }

  public getTweetBorder(score: number): string {
    return '2px solid ' + this.colour(score);
  }

  public getTweetColour(score: number): string {
    return this.colour(score);
  }
}
