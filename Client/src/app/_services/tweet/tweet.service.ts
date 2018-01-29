import { Injectable } from '@angular/core';
import { WebSocketService } from '../web-socket/web-socket.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import {Tweet} from '../../_models/Tweet';


@Injectable()
export class TweetService {

  public glasgow_tweets: Subject<Tweet>;
  public glasgow_geo_tweets: Subject<Tweet>;
  public scotland_tweets: Subject<Tweet>;
  public scotland_geo_tweets: Subject<Tweet>;

  // Our constructor calls our wsService connect method
  constructor(private wsService: WebSocketService) {
    this.glasgow_tweets = <Subject<Tweet>>wsService
      .connect_glasgow()
      .map((response: any): Tweet => {
        return response;
      });

    this.glasgow_geo_tweets = <Subject<Tweet>>wsService
      .connect_glasgow_geo()
      .map((response: any): Tweet => {
        return response;
      });

    this.scotland_tweets = <Subject<Tweet>>wsService
      .connect_scotland()
      .map((response: any): Tweet => {
        return response;
      });

    this.scotland_geo_tweets = <Subject<Tweet>>wsService
      .connect_scotland_geo()
      .map((response: any): Tweet => {
        return response;
      });
  }

}
