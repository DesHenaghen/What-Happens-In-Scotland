import { TestBed, inject } from '@angular/core/testing';

import { TweetService } from './tweet.service';
import {WebSocketService} from '../';
import {of} from 'rxjs/observable/of';

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
});
