import { TestBed } from '@angular/core/testing';

import { ScotlandDataManagerService } from './scotland-data-manager.service';
import {Tweet} from '../../_models/Tweet';
import {TweetService} from '../index';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {of} from 'rxjs/observable/of';
import * as moment from 'moment';
import {District} from '../../_models/District';

describe('ScotlandDataManagerService', () => {
  let service: ScotlandDataManagerService;
  let mockHttp: HttpTestingController;
  let tweetsSpy: any;

  beforeEach(() => {
    tweetsSpy = jasmine.createSpyObj('TweetService',
      [
        'getTweets',
        'getScotlandDistrictTweets',
        'getScotlandWardTweets',
        'setTweets'
      ]
    );

    tweetsSpy.getScotlandDistrictTweets.and.returnValue(of(new Tweet()));
    tweetsSpy.getScotlandWardTweets.and.returnValue(of(new Tweet()));

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ScotlandDataManagerService,
        {provide: TweetService, useValue: tweetsSpy}
      ]
    });

    service = TestBed.get(ScotlandDataManagerService);
    mockHttp = TestBed.get(HttpTestingController);

    const testDistrict = new District();
    testDistrict.values = [{x: new Date().getTime(), y: 2}];
    testDistrict.totals = [0];
    service.districts = {'uniqueid': testDistrict};
  });

  afterEach(() => {
    mockHttp.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit the latest tweet', () => {
    service.updateLastTweet(new Tweet(), 'uniqueid');
    service.getLatestTweet().subscribe(tweet => {
      if (tweet)
        expect(tweet.id).toBe('uniqueid');
    });
  });

  it('should highlight good and bad words in strings', () => {
    const tweet = new Tweet();
    tweet.text_sentiment_words = ['bad', 'good', 'meh'];
    tweet.text_sentiments = [-2, 2, 0];
    const words = [];
    const scores = [];

    // Expect individual words to be formatted correctly
    expect(service.highlightEmotiveWords('bad', tweet, words, scores))
      .toBe('<span class="bad_word">bad</span>');
    expect(service.highlightEmotiveWords('good', tweet, words, scores))
      .toBe('<span class="good_word">good</span>');
    expect(service.highlightEmotiveWords('meh', tweet, words, scores))
      .toBe('meh');

    // expect arrays to conatin old tweet values
    expect(words).toEqual(['bad', 'good', 'meh']);
    expect(scores).toEqual([-2, 2, 0]);
  });

  it('should update the district with new tweet values', () => {
    const tweet = new Tweet();
    tweet.user = {name: 'testUser'};
    tweet.score = 66;
    service.updateLastTweet(tweet, 'uniqueid');

    expect(service.districts['uniqueid'].average).toBe(66);
    expect(service.districts['uniqueid'].prettyAverage).toBe(66);
    expect(service.districts['uniqueid'].totals[0]).toBe(1);
    expect(service.districts['uniqueid'].values[0].y).toBe(66);
    expect(service.districts['uniqueid'].last_tweets[0].id).toBe('uniqueid');
  });

  it('should add new hourly data when a new tweet is received in the new hour', () => {
    const tweet = new Tweet();
    const date = new Date();
    date.setHours(date.getHours() + 1);
    tweet.date = date;
    service.updateLastTweet(tweet, 'uniqueid');

    expect(service.districts['uniqueid'].values.length).toBe(2);
  });

  it('should load data for the districts', () => {
    const dummyData = {
      'S13002660': {
        'last_tweet': {
          'score': 10.470000000000002,
          'scores': [
            'now'
          ],
          'text': '@IvankaTrump @pewresearch @dcexaminer now watch it fall apart with the trading ' +
          '<span class=\'bad_word\'>wars</span> which will <span class=\'bad_word\'>hurt</span> US farming ' +
          '&amp; technologies',
          'words': [
            0
          ]
        },
        'total': 12,
        'totals': [
          12
        ],
        'values': [
          {
            'x': 1521669600000,
            'y': 50
          }
        ]
      }
    };

    service.loadDistrictsData();

    setInterval(() => {
      const req = mockHttp.expectOne(r => r.method === 'GET' && r.url === '/api/all_scotland_ward_data');
      req.flush(dummyData);

      expect(service.districts['S13002660'].average).toBe(50);
    }, 500);
  });

  it('should fetch common words for each district', () => {
    const dummyData = {
      'S13002660': {
        'last_tweet': {
          'score': 10.470000000000002,
          'scores': [
            'now'
          ],
          'text': '@IvankaTrump @pewresearch @dcexaminer now watch it fall apart with the trading ' +
          '<span class=\'bad_word\'>wars</span> which will <span class=\'bad_word\'>hurt</span> US farming ' +
          '&amp; technologies',
          'words': [
            0
          ]
        },
        'total': 12,
        'totals': [
          12
        ],
        'values': [
          {
            'x': 1521669600000,
            'y': 50
          }
        ]
      }
    };

    service.loadDistrictsData();

    setInterval(() => {
      const req = mockHttp.expectOne(r => r.method === 'GET' && r.url === '/api/all_scotland_ward_data');
      req.flush(dummyData);

      const wordReq = mockHttp.expectOne(r => r.method === 'GET' && r.url === '/api/common_words');
      wordReq.flush(['hi, -2, 456']);

      expect(service.districts['S13002660'].common_emote_words).toEqual(['hi, -2, 456']);
    }, 500);
  });

  it('should set the update tweets flag', () => {
    service.setUpdateTweets(false);
    expect(service.updateTweets).toBe(false);

    service.setUpdateTweets(true);
    expect(service.updateTweets).toBe(true);
  });

  it('should refresh all districts data', () => {
    const dummyData = {
      'S13002660': {
        'last_tweet': {
          'score': 10.470000000000002,
          'scores': [
            'now'
          ],
          'text': '@IvankaTrump @pewresearch @dcexaminer now watch it fall apart with the trading ' +
          '<span class=\'bad_word\'>wars</span> which will <span class=\'bad_word\'>hurt</span> US farming ' +
          '&amp; technologies',
          'words': [
            0
          ]
        },
        'total': 12,
        'totals': [
          12
        ],
        'values': [
          {
            'x': 1521669600000,
            'y': 50
          }
        ]
      }
    };

    service.loadDistrictsData();

    setInterval(() => {
      const req = mockHttp.expectOne(r => r.method === 'GET' && r.url === '/api/all_scotland_ward_data');
      req.flush(dummyData);

      service.refreshAllDistrictsData(new Date(), 3);
      const dummyData2 = {
        'S13002660': {
          'last_tweet': {
            'score': 88,
            'scores': [
              'now'
            ],
            'text': '@IvankaTrump @pewresearch @dcexaminer now watch it fall apart with the trading ' +
            '<span class=\'bad_word\'>wars</span> which will <span class=\'bad_word\'>hurt</span> US farming ' +
            '&amp; technologies',
            'words': [
              0
            ]
          },
          'total': 12,
          'totals': [
            12
          ],
          'values': [
            {
              'x': 1521669600000,
              'y': 36
            }
          ]
        }
      };
      req.flush(dummyData2);
      expect(service.districts['S13002660'].average).toBe(36);
    }, 500);
  });

  it('should fetch tweets from the districts', () => {
    service.fetchDistrictTweets(moment(), false);

    const req = mockHttp.expectOne(r => r.method === 'GET' && r.url === '/api/districts_tweets');
    expect(req.request.method).toBe('GET');
    req.flush({});

    expect(tweetsSpy.setTweets).toHaveBeenCalledTimes(1);
  });

});
