import { Injectable } from '@angular/core';
import { WebSocketService } from '../web-socket/web-socket.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import {Tweet} from '../../_models/Tweet';


@Injectable()
export class TweetService {

  public scotland_ward_tweets: Subject<Tweet>;
  public scotland_district_tweets: Subject<Tweet>;

  // Our constructor calls our wsService connect method
  constructor(private wsService: WebSocketService) {
    this.scotland_ward_tweets = <Subject<Tweet>>wsService
      .connect_scotland_wards()
      .map((response: any): Tweet => {
        return response;
      });

    this.scotland_district_tweets = <Subject<Tweet>>wsService
      .connect_scotland_districts()
      .map((response: any): Tweet => {
        return response;
      });
  }

}
