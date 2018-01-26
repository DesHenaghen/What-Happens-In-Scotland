import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { NvD3Module } from 'ng2-nvd3';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { HappyRankComponent } from './happy-rank/happy-rank.component';
import { HappyTimelineComponent } from './happy-timeline/happy-timeline.component';
import { GlasgowMapComponent } from './glasgow-map/glasgow-map.component';
import { TweetBoxComponent } from './tweet-box/tweet-box.component';

import {DataService} from './data.service';
import {TweetService} from './tweet.service';
import {WebSocketService} from './web-socket.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HappyRankComponent,
    HappyTimelineComponent,
    GlasgowMapComponent,
    TweetBoxComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NvD3Module,
    AppRoutingModule
  ],
  providers: [
    DataService,
    TweetService,
    WebSocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
