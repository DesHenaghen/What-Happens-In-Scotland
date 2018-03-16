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

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    const tweetServiceSpy = jasmine.createSpyObj('TweetService', ['getTweets']);
    const dataManagerSpy = jasmine.createSpyObj('DataManagerService', ['getDataManager']);

    dataManagerSpy.getDataManager.and.returnValue(of(undefined));

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
        {provide: DataManagerService, useValue: dataManagerSpy},
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
});
