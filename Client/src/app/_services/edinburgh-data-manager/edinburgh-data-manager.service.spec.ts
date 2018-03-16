import { TestBed, inject } from '@angular/core/testing';

import { EdinburghDataManagerService } from './edinburgh-data-manager.service';
import {HttpClientModule} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TweetService} from '../';
import {of} from 'rxjs/observable/of';
import {Tweet} from '../../_models/Tweet';

describe('EdinburghDataManagerService', () => {
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
        EdinburghDataManagerService,
        {provide: TweetService, useValue: tweetsSpy}
      ]
    });
  });

  it('should be created', inject([EdinburghDataManagerService], (service: EdinburghDataManagerService) => {
    expect(service).toBeTruthy();
  }));
});
