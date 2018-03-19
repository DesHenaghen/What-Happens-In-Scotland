import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {ScrollToModule} from '@nicky-lenaers/ngx-scroll-to';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule, MatNativeDateModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {DataManagerService, TweetService} from '../_services';
import {of} from 'rxjs/observable/of';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {District} from "../_models/District";
import {MapModes} from "../_models/MapModes";
import * as moment from 'moment';
import {Tweet} from "../_models/Tweet";
import {packageChunkSort} from "@angular/cli/utilities/package-chunk-sort";

class MockDataManager {
  dataFile = 'scotland-councils-simplified.json';
  topologyId = 'LAD13CD';
  topologyName = 'LAD13NM';
  mapType = 'scotland';
  regionName = 'Scotland';
  districtId = 'scotland-boundary';
  mapMode = MapModes.Scotland;
  allowRegionPulsing = false;
  apiDataRoute = 'all_scotland_district_data';
  private district = new BehaviorSubject(new District());

  getDistricts = () => of({'test': 50});
  getLoadedData = () => of(true);
  getDistrict = () => this.district.asObservable();
  getLatestTweet = () => of(undefined);
  getMapTopology = () => of(undefined);
  getMapBoundaryId = () => 'test';
  setDistrict = (id) => {
    const district = new District();
    district.id = id;
    this.district.next(district);
  }
  getDataManager = () => {
    return of(this);
  }
  getTweets = () => {
    const today = moment().format('YYYY-MM-DD');
    const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
    const preyesterday = moment().subtract(2, 'day').format('YYYY-MM-DD');

    const tweet1 = new Tweet();
    tweet1.text = 'yes';
    tweet1.score = 1;

    const tweet2 = new Tweet();
    tweet2.text = 'pfft';
    tweet2.score = 99;

    return of({
      [today]: [tweet1, tweet2],
      [yesterday]: [tweet1, tweet2],
      [preyesterday]: [tweet1, tweet2]
    });
  }
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    const tweetServiceSpy = jasmine.createSpyObj('TweetService', ['getTweets']);

    TestBed.configureTestingModule({
      declarations: [
        HomeComponent
      ],
      imports: [
        FormsModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        BrowserAnimationsModule,
        ScrollToModule.forRoot()
      ],
      providers: [
        {provide: DataManagerService, useClass: MockDataManager},
        {provide: TweetService, useValue: tweetServiceSpy}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display tweets from date', () => {
    // Switch tab to tweets
    fixture.debugElement.nativeElement.querySelector('#tweet_box_tab').click();
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('#fwoop').children.length)
      .toBe(2);
  });

  it('should filter tweets with key word', () => {
    const searchBox = fixture.debugElement.nativeElement.querySelector('#tweet-search-box');

    // Switch tab to tweets
    fixture.debugElement.nativeElement.querySelector('#tweet_box_tab').click();
    searchBox.value = 'yes';
    searchBox.dispatchEvent(new Event('input'));
    expect(component.filteredTweets[component.currentKey].length)
      .toBe(1);

    searchBox.value = 'no';
    searchBox.dispatchEvent(new Event('input'));
    expect(component.filteredTweets[component.currentKey].length)
      .toBe(0);
  });

  it('should sort tweets based on sort option', () => {
    const sortBox = fixture.debugElement.nativeElement.querySelector('#sort_tweets');

    // Switch tab to tweets
    fixture.debugElement.nativeElement.querySelector('#tweet_box_tab').click();
    sortBox.value = component.TweetSorting.SCORE_DESC;
    sortBox.dispatchEvent(new Event('selectionChange'));
    expect(component.filteredTweets[component.currentKey][0].score).toBe(99);

    sortBox.value = component.TweetSorting.SCORE_ASC;
    sortBox.dispatchEvent(new Event('selectionChange'));
    expect(component.filteredTweets[component.currentKey][0].score).toBe(1);
  });
});
