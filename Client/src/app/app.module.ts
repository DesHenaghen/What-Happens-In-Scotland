// 3rd Party Imports
import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { NvD3Module } from 'ng2-nvd3';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { HappyRankComponent } from './happy-rank/happy-rank.component';
import { HappyTimelineComponent } from './happy-timeline/happy-timeline.component';
import { GlasgowMapComponent } from './glasgow-map/glasgow-map.component';
import { TweetBoxComponent } from './tweet-box/tweet-box.component';
import { ScotlandMapComponent } from './scotland-map/scotland-map.component';
import { EdinburghMapComponent } from './edinburgh-map/edinburgh-map.component';

// Services
import {
  DataManagerService,
  TweetService,
  WebSocketService,
  GlasgowDataManagerService,
  ScotlandDataManagerService, EdinburghDataManagerService
} from './_services';

// Pipes
import { ReversePipe } from './_pipes/reverse.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HappyRankComponent,
    HappyTimelineComponent,
    GlasgowMapComponent,
    TweetBoxComponent,
    ScotlandMapComponent,
    EdinburghMapComponent,
    ReversePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NvD3Module,
    AppRoutingModule,
    MatTabsModule,
    MatCardModule,
    BrowserAnimationsModule,
    ScrollToModule.forRoot()
  ],
  providers: [
    TweetService,
    WebSocketService,
    GlasgowDataManagerService,
    ScotlandDataManagerService,
    EdinburghDataManagerService,
    DataManagerService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
