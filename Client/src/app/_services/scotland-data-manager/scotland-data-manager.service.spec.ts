import { TestBed, inject } from '@angular/core/testing';

import { ScotlandDataManagerService } from './scotland-data-manager.service';
import {Tweet} from '../../_models/Tweet';
import {TweetService} from '../index';
import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {of} from 'rxjs/observable/of';

describe('ScotlandDataManagerService', () => {
  beforeEach(() => {
    const tweetsSpy = jasmine.createSpyObj('TweetService',
      [
        'getTweets',
        'getScotlandDistrictTweets',
        'getScotlandWardTweets'
      ]
    );

    tweetsSpy.getScotlandDistrictTweets.and.returnValue(of(new Tweet()));
    tweetsSpy.getScotlandWardTweets.and.returnValue(of(new Tweet()));

    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        ScotlandDataManagerService,
        {provide: TweetService, useValue: tweetsSpy}
      ]
    });
  });

  it('should be created', inject([ScotlandDataManagerService], (service: ScotlandDataManagerService) => {
    expect(service).toBeTruthy();
  }));
});
