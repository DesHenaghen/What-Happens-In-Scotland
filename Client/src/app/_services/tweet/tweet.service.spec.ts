import { TestBed, inject } from '@angular/core/testing';

import { TweetService } from './tweet.service';
import {WebSocketService} from '../';
import {of} from 'rxjs/observable/of';
import {Tweet} from '../../_models/Tweet';

import * as moment from 'moment';

describe('TweetService', () => {
  beforeEach(() => {
    const websocketSpy = jasmine.createSpyObj('WebSocketService',
      [
        'connect_scotland_districts',
        'connect_scotland_wards'
      ]
    );

    websocketSpy.connect_scotland_districts.and.returnValue(of(undefined));
    websocketSpy.connect_scotland_wards.and.returnValue(of(undefined));

    TestBed.configureTestingModule({
      providers: [
        TweetService,
        {provide: WebSocketService, useValue: websocketSpy}
      ]
    });
  });

  it('should be created', inject([TweetService], (service: TweetService) => {
    expect(service).toBeTruthy();
  }));

  it('should append a new day of tweets', () => {
    const service: TweetService = TestBed.get(TweetService);

    const testDate1 = new Date(2018, 2, 22);
    service.setTweets([], moment(testDate1), false);

    const testDate2 = new Date(2018, 2, 23);
    service.setTweets([], moment(testDate2), true);

    service.getTweets().subscribe((tweets) => {
      expect(tweets.hasOwnProperty('2018-03-22') && tweets.hasOwnProperty('2018-03-23')).toBeTruthy();
    });
  });

  it('should add a new tweet to tweets', () => {
    const service: TweetService = TestBed.get(TweetService);
    const testDate = new Date(2018, 2, 22);

    service.setTweets([], moment(testDate), false);

    const newTweet = new Tweet();
    newTweet.id = '55678';
    service.addTweet(newTweet, testDate);

    service.getTweets().subscribe((tweets) => {
      expect(tweets['2018-03-22'][0].id).toBe('55678');
    });
  });
});
