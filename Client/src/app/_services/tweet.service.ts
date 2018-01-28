import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import {Tweet} from '../_models/Tweet';


@Injectable()
export class TweetService {

  glasgow_tweets: Subject<Tweet>;
  geo_tweets: Subject<Tweet>;

  // Our constructor calls our wsService connect method
  constructor(private wsService: WebSocketService) {
    this.glasgow_tweets = <Subject<Tweet>>wsService
      .connect_glasgow()
      .map((response: any): Tweet => {
        return response;
      });

    this.geo_tweets = <Subject<Tweet>>wsService
      .connect_geo()
      .map((response: any): Tweet => {
        return response;
      });
  }

}
