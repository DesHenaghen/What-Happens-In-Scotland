import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class TweetService {

  glasgow_tweets: Subject<any>;
  geo_tweets: Subject<any>;

  // Our constructor calls our wsService connect method
  constructor(private wsService: WebSocketService) {
    this.glasgow_tweets = <Subject<any>>wsService
      .connect_glasgow()
      .map((response: any): any => {
        return response;
      });

    this.geo_tweets = <Subject<any>>wsService
      .connect_geo()
      .map((response: any): any => {
        return response;
      });
  }

  // Our simplified interface for sending
  // messages back to our socket.io server
  sendMsg(msg) {
    this.glasgow_tweets.next(msg);
  }

}
