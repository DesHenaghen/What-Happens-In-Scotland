import { Injectable } from '@angular/core';
import { WebSocketService } from '../web-socket/web-socket.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import {Tweet} from '../../_models/Tweet';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import * as moment from 'moment';


@Injectable()
export class TweetService {

  private tweets: {[id: string]: Tweet[]} = {};
  private tweetsObserver = new BehaviorSubject<{[id: string]: Tweet[]}>({});

  private scotland_ward_tweets: Subject<Tweet>;
  private scotland_district_tweets: Subject<Tweet>;

  // Our constructor calls our wsService connect method
  constructor(private wsService: WebSocketService) {
    this.scotland_ward_tweets = <Subject<Tweet>>wsService
      .connect_scotland_wards()
      .map((response: any): Tweet => {
        return response;
      });

    this.scotland_district_tweets = <Subject<Tweet>>wsService
      .connect_scotland_districts()
      .map((response: any): Tweet => {
        return response;
      });
  }

  /**
   * Returns an Observable of the dictionary of tweet arrays
   * @returns {Observable<{[p: string]: Tweet[]}>}
   */
  public getTweets() {
    return this.tweetsObserver.asObservable();
  }

  public getScotlandDistrictTweets(): Subject<Tweet> {
    return this.scotland_district_tweets;
  }

  public getScotlandWardTweets(): Subject<Tweet> {
    return this.scotland_ward_tweets;
  }

  /**
   * Sets the whole tweet array for the specified day
   * @param {Tweet[]} tweets
   * @param date
   * @param {boolean} append
   */
  public setTweets(tweets: Tweet[], date, append: boolean) {
    if (!append) {
      this.tweets = {};
    }

    this.tweets[date.format('YYYY-MM-DD')] = tweets;

    this.tweetsObserver.next(this.tweets);
  }

  /**
   * Adds a tweet to the tweet array for the specified day, if possible
   * @param {Tweet} tweet
   * @param {Date} date
   */
  public addTweet(tweet: Tweet, date: Date = new Date()) {
    const mDate = moment(date);
    if (this.tweets[mDate.format('YYYY-MM-DD')]) {
      this.tweets[mDate.format('YYYY-MM-DD')].push(tweet);
      this.tweetsObserver.next(this.tweets);
    }
  }
}
