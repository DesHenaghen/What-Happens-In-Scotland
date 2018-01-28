import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import {Tweet} from '../_models/Tweet';

@Injectable()
export class WebSocketService {

  // Our socket connection
  private socket;

  constructor() {
    this.socket = io();
  }

  public connect_glasgow(): Subject<MessageEvent> {

    const observable = new Observable(ob => {
      this.socket.on('glasgow_tweet', (data: Tweet) => ob.next(data));

      return () => this.socket.disconnect();
    });

    const observer = {
      next: (data: Object) => {
        this.socket.emit('message', JSON.stringify(data));
      },
    };

    return Subject.create(observer, observable);
  }

  public connect_geo(): Subject<MessageEvent> {

    const observable = new Observable(ob => {
      this.socket.on('geo_tweet', (data: Tweet) => ob.next(data));

      return () => this.socket.disconnect();
    });

    const observer = {
      next: (data: Object) => {
        this.socket.emit('message', JSON.stringify(data));
      },
    };

    return Subject.create(observer, observable);
  }

}
