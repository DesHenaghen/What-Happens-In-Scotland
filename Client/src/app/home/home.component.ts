import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TweetService, DataManagerService} from '../_services';
import {District} from '../_models/District';
import {MatTabChangeEvent, MatTabGroup} from '@angular/material';
import {MapModes} from '../_models/MapModes';
import {Subscription} from 'rxjs/Subscription';
import {Tweet} from '../_models/Tweet';

declare let d3: any;
import * as moment from 'moment';

/**
 * The base component for the home screen. Manages the styling of the page as well as the loading and modification
 * of wards data.
 */
@Component({
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  @ViewChild('mapModeTabs') mapModeTabs: MatTabGroup;
  @ViewChild('tweetDateTabs') tweetDateTabs: MatTabGroup;

  public district: District = new District();
  public districts: {[id: string]: District} = {};

  public mapModes = MapModes;
  public currentMode: MapModes;

  public endDate: Date;
  public period: number;
  public tweetDates: any[] = [
    {dateString: '2018-02-21', title: 'Today'},
    {dateString: '2018-02-20', title: 'Yesterday'}
  ];

  private colour: any;

  protected tweets: {[id: string]: Tweet[]} = {};
  protected filteredTweets: {[id: string]: Tweet[]} = {};

  private districtSubscription: Subscription = new Subscription();
  private districtsSubscription: Subscription = new Subscription();
  private tweetsSubscription: Subscription = new Subscription();

  constructor(
    private _http: HttpClient,
    private _tweet: TweetService,
    private _dataManager: DataManagerService
  ) { }

  public ngOnInit(): void {
    this.endDate = new Date();
    this.period = 7;

    this.currentMode = MapModes.Scotland;

    this._dataManager.getDataManager().subscribe(dm => {
      if (dm !== undefined) {
        this.subscribeForDistrictData();
      }
    });

    this.colour = d3.scale.linear()
      .domain([-1, /*-0.1, 0.1,*/0, 1])
      .range(['#ff000c', /*'#8f8f8f',*/ '#b2b2b2', '#0500ff']);
  }

  private subscribeForDistrictData(): void {

    // Manage District Subscription
    if (!this.districtSubscription.closed) {
      this.districtSubscription.unsubscribe();
    }
    this.districtSubscription = this._dataManager.getDistrict().subscribe((district: District) => {
      this.district = district;
      this.setStyling(district.id);
    });

    // Manage Districts Subscription
    if (!this.districtsSubscription.closed) {
      this.districtsSubscription.unsubscribe();
    }
    this.districtsSubscription = this._dataManager.getDistricts().subscribe(
      (districts: {[id: string]: District}) => this.districts = districts
    );

    if (!this.tweetsSubscription.closed) {
      this.tweetsSubscription.unsubscribe();
    }
    this.tweetsSubscription = this._dataManager.getTweets().subscribe((tweets: {[id: string]: Tweet[]}) => {
      for (const key of Object.keys(tweets)) {
        // If we don't already have tweets for this date, add them
        if (!this.tweets.hasOwnProperty(key)) {
          this.tweets[key] = tweets[key]
            .filter(item => (item.area === this._dataManager.districtId || this._dataManager.mapMode === MapModes.Scotland))
            .sort((a, b) => (moment(a.date).isAfter(moment(b.date))) ? -1 : 1);
        }
      }

      Object.keys(this.tweets).forEach(key => {
        if (!tweets.hasOwnProperty(key)) delete this.tweets[key];
      });

      console.log(this.district);
      this.setFilteredTweets();

      console.log(this.tweets, this.filteredTweets);

      this.tweetDates = [];
      const date = moment(this.endDate);

      while (date.isAfter(moment(this.endDate).subtract(this.period, 'days'))) {
        this.tweetDates.push({
          dateString: date.format('YYYY-MM-DD'),
          title: date.format('Do MMM'),
          loaded: tweets.hasOwnProperty(date.format('YYYY-MM-DD'))
        });

        date.subtract(1, 'days');
      }

      console.log(this.tweetDates);
    });
  }

  public refreshData(): void {
    this._dataManager.refreshAllDistrictsData(this.endDate, this.period);
  }

  public setEndDate(dateString: string) {
    this.endDate = new Date(dateString);
  }

  private setFilteredTweets(limit = 10) {
    const filteredTweets = this.tweets;
    for (const [key] of Object.entries(filteredTweets)) {
      this.filterTweets(key, limit, filteredTweets);
    }
  }

  public filterTweets(key, limit, filteredTweets = this.tweets)  {
    this.filteredTweets[key] = filteredTweets[key]
      .filter((item, index) => index < limit )
      .map(tweet => {
        const new_words = [], new_scores = [];
        tweet.text = tweet.text.split(' ').map(word =>
          this._dataManager.highlightEmotiveWords(word, tweet, new_words, new_scores)).join(' ');
        tweet.text_sentiment_words = [...new_words, ...tweet.text_sentiment_words];
        tweet.text_sentiments = [...new_scores, ...tweet.text_sentiments];
        return tweet;
      });
  }

  public getDateFilteredTweets(tweetDate) {
    const key = tweetDate.dateString;
    return (this.filteredTweets.hasOwnProperty(key))
      ? this.filteredTweets[key]
      : [];
  }

  /**
   * Sets the css styling based on which ward is selected.
   * @param {string} area - id of the selected ward
   */
  private setStyling(area: string): void {
    if (area !== undefined) {
      this.clearSelectedClass();
      document.getElementById(area).classList.add('selected');
      document.getElementById('districtInfoBox').style.border = '6px solid ' + this.colour(this.district.average);
    }
  }

  public tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    this.setMode(tabChangeEvent.index);
  }

  public setMode(index: MapModes): void {
    this.mapModeTabs.selectedIndex = index;
    this.currentMode = index;
    this._dataManager.selectDataManager(this.currentMode);
  }

  /**
   * Removes the selected class from all wards drawn on the map
   */
  private clearSelectedClass(): void {
    for (const [key] of Object.entries(this.districts)) {
      document.getElementById(key).classList.remove('selected');
    }
  }

  public commonWord(index: number) {
    return (this.district.common_emote_words && this.district.common_emote_words[index])
      ? this.district.common_emote_words[index].split(',')[0]
      : '';
  }

  public tweetDateTabChanged(event) {
    console.log(event);
    if (!this.tweetDates[event.index].loaded) {
      this._dataManager.fetchDistrictTweets(moment(this.tweetDates[event.index].dateString), true);
    }
  }

  public getTweetBorder(score: number): string {
    return '2px solid ' + this.colour(score);
  }
}

