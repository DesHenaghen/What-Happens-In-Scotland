import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TweetBoxComponent } from './tweet-box.component';
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {DataManagerService} from '../_services';
import {District} from '../_models/District';
import {Tweet} from '../_models/Tweet';

describe('TweetBoxComponent', () => {
  let component: TweetBoxComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  beforeEach(async(() => {
    const dataManagerSpy = jasmine.createSpyObj('DataManagerService',
      [
        'setUpdateTweets'
      ]
    );

    TestBed.configureTestingModule({
      declarations: [
        TestComponentWrapper,
        TweetBoxComponent
      ],
      providers: [
        {provide: DataManagerService, useValue: dataManagerSpy}
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponentWrapper);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pause the live tweets', () => {
    expect(component.liveTweets).toBeTruthy();
    const pauseButton = fixture.debugElement.nativeElement.querySelector('#pause_button');
    pauseButton.click();
    expect(component.liveTweets).toBeFalsy();
  });

  it('extra live tweets should be rendered on screen', () => {
    const componentWrapper = fixture.componentInstance;
    componentWrapper.ward.last_tweets.push(new Tweet());

    fixture.detectChanges();

    let tweetsCount = fixture.debugElement.nativeElement.querySelectorAll('.tweet_details').length;
    expect(tweetsCount).toBe(1);

    componentWrapper.ward.last_tweets.push(new Tweet());
    fixture.detectChanges();

    tweetsCount = fixture.debugElement.nativeElement.querySelectorAll('.tweet_details').length;
    expect(tweetsCount).toBe(2);
  });
});

@Component({
  selector: 'test-component-wrapper',
  template: '<app-tweet-box [ward]="ward"></app-tweet-box>'
})
class TestComponentWrapper {
  ward = new District();
}
