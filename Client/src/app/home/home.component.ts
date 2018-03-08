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
import {HappyTimelineComponent} from '../happy-timeline/happy-timeline.component';
import {HappyRankComponent} from '../happy-rank/happy-rank.component';
import {Colour} from '../_models/Colour';

enum TweetSorting {
  DATE_DESC = 'Date Desc',
  DATE_ASC = 'Date Asc',
  SCORE_DESC = 'Score Desc',
  SCORE_ASC = 'Score Asc'
}

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
  @ViewChild('infoBoxTabs') infoBoxTabs: MatTabGroup;
  @ViewChild('tweetDateTabs') tweetDateTabs: MatTabGroup;
  @ViewChild(HappyTimelineComponent) timelineChart;
  @ViewChild(HappyRankComponent) rankChart;

  public TweetSorting = TweetSorting;
  public district: District = new District();
  public districts: {[id: string]: District} = {};

  public mapModes = MapModes;
  public currentMode: MapModes;

  public endDate: Date;
  public period: number;
  public tweetDates: any[] = [];
  public minDate = new Date(2017, 11, 1);
  public maxDate = new Date();

  public sorting: TweetSorting = TweetSorting.DATE_DESC;
  public searchTerm = '';
  public currentKey: string;

  private colour: any;

  public tweets: {[id: string]: Tweet[]} = {};
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
    this.period = 3;

    this.currentMode = MapModes.Scotland;

    this._dataManager.getDataManager().subscribe(dm => {
      if (dm !== undefined) {
        this.subscribeForDistrictData();
      }
    });

    this.colour = Colour.getColour;
  }

  private subscribeForDistrictData(): void {

    // Manage District Subscription
    if (!this.districtSubscription.closed) {
      this.districtSubscription.unsubscribe();
    }
    this.districtSubscription = this._dataManager.getDistrict().subscribe((district: District) => {
      this.district = district;
      this.setStyling(district.id);
      this.filterTweets(this.currentKey, this.getDateFilteredTweets({dateString: this.currentKey}).length);
    });

    // Manage Districts Subscription
    if (!this.districtsSubscription.closed) {
      this.districtsSubscription.unsubscribe();
    }
    this.districtsSubscription = this._dataManager.getDistricts().subscribe(
      (districts: {[id: string]: District}) => this.districts = districts
    );

    // Manage Tweets Subscription
    if (!this.tweetsSubscription.closed) {
      this.tweetsSubscription.unsubscribe();
    }
    this.tweetsSubscription = this._dataManager.getTweets().subscribe((tweets: {[id: string]: Tweet[]}) => {
      for (const key of Object.keys(tweets)) {
        this.tweets[key] = tweets[key]
          .filter(item => (item.area === this._dataManager.districtId || this._dataManager.mapMode === MapModes.Scotland))
          .sort((a, b) => (a.date < b.date) ? -1 : 1);
      }

      Object.keys(this.tweets).forEach(key => {
        if (!tweets.hasOwnProperty(key)) delete this.tweets[key];
      });

      this.tweetDates = [];
      const date = moment(this.endDate);

      while (date.isAfter(moment(this.endDate).subtract(this.period, 'days'))) {
        this.tweetDates.push({
          dateString: date.format('YYYY-MM-DD'),
          title: date.format('Do MMM'),
          loaded: tweets.hasOwnProperty(date.format('YYYY-MM-DD')),
          total: 0
        });

        date.subtract(1, 'days');
      }
      this.setFilteredTweets();
    });
  }

  public refreshData(): void {
    this._dataManager.refreshAllDistrictsData(this.endDate, this.period);
  }

  private setFilteredTweets(limit = 10) {
    const filteredTweets = this.tweets;
    for (const [key] of Object.entries(filteredTweets)) {
      this.filterTweets(key, limit);
    }
  }

  public filterTweets(key: string, limit: number)  {
    this.currentKey = key;
    const ward = this.district.id;
    const filteredTweets = Object.assign({}, this.tweets);
    const searchTermLower = this.searchTerm.toLowerCase();

    let i = 0;
    let totalTweets = 0;
    if (filteredTweets.hasOwnProperty(key)) {
      this.filteredTweets[key] = filteredTweets[key]
        .sort((a, b) => {
          switch (this.sorting) {
            case TweetSorting.DATE_DESC:
              return b.date < a.date ? -1 : 1;
            case TweetSorting.DATE_ASC:
              return a.date > b.date ? 1 : -1;
            case TweetSorting.SCORE_DESC:
              return b.score - a.score;
            case TweetSorting.SCORE_ASC:
              return a.score - b.score;
            default:
              return 0;
          }
        })
        .filter(tweet => {
          if ((ward === this._dataManager.getMapBoundaryId() || ward === tweet.ward || ward === tweet.area) &&
            ((tweet.name && tweet.name.toLowerCase().includes(searchTermLower)) || (tweet.text && tweet.text.toLowerCase().includes(searchTermLower)))) {
            totalTweets++;
            if (i < limit) {
              i++;
              return true;
            }
            return false;
          }
          return false;
        });
    }

    for (const k in Object.keys(this.tweetDates)) {
      if (this.tweetDates[k].dateString === key) {
        this.tweetDates[k].total = totalTweets;
      }
    }
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
      if (document.getElementById(area))
        document.getElementById(area).classList.add('selected');
    }
  }

  public tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    this.setMode(tabChangeEvent.index);
  }

  public setMode(index: MapModes): void {
    console.log(index);
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
    if (!this.tweetDates[event.index].loaded) {
      this._dataManager.fetchDistrictTweets(moment(this.tweetDates[event.index].dateString), true);
    }
  }

  public trackByFn(index, tweet: Tweet) {
    return tweet.id;
  }

  public trackByTweetDate(index, tweetDate) {
    return tweetDate.dateString;
  }

  public infoBoxTabChanged(event) {
    this.timelineChart.refreshChart();
    this.rankChart.refreshChart();

  }

  public getTweetColour(score: number): string {
    return this.colour(score);
  }

  public sortTweets(dateTweet) {
    this.filterTweets(dateTweet.dateString, this.getDateFilteredTweets(dateTweet).length);
  }
}

