// 3rd Party Imports
import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { NvD3Module } from 'ng2-nvd3';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HappyRankComponent } from './happy-rank/happy-rank.component';
import { HappyTimelineComponent } from './happy-timeline/happy-timeline.component';
import { GlasgowMapComponent } from './map/glasgow-map/glasgow-map.component';
import { TweetBoxComponent } from './tweet-box/tweet-box.component';
import { ScotlandMapComponent } from './map/scotland-map/scotland-map.component';
import { EdinburghMapComponent } from './map/edinburgh-map/edinburgh-map.component';

// Services
import {
  DataManagerService,
  TweetService,
  WebSocketService,
  GlasgowDataManagerService,
  ScotlandDataManagerService, EdinburghDataManagerService
} from './_services';

import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HappyRankComponent,
    HappyTimelineComponent,
    GlasgowMapComponent,
    TweetBoxComponent,
    ScotlandMapComponent,
    EdinburghMapComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NvD3Module,
    MatTabsModule,
    MatCardModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    BrowserAnimationsModule,
    ScrollToModule.forRoot()
  ],
  providers: [
    TweetService,
    WebSocketService,
    GlasgowDataManagerService,
    ScotlandDataManagerService,
    EdinburghDataManagerService,
    DataManagerService,
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
