import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class WebSocketService {

  // Our socket connection
  private socket;

  constructor() {
    this.socket = io();
  }

  connect_glasgow(): Subject<MessageEvent> {
    // We define our observable which will observe any incoming glasgow_tweets
    // from our socket.io server.
    const observable = new Observable(ob => {
      this.socket.on('glasgow_tweet', (data) => {
        // console.log('Received Glasgow tweet');
        ob.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });

    // We define our Observer which will listen to glasgow_tweets
    // from our other components and send glasgow_tweets back to our
    // socket server whenever the `next()` method is called.
    const observer = {
      next: (data: Object) => {
        this.socket.emit('message', JSON.stringify(data));
      },
    };

    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    return Subject.create(observer, observable);
  }

  connect_geo(): Subject<MessageEvent> {
    // We define our observable which will observe any incoming glasgow_tweets
    // from our socket.io server.
    const observable = new Observable(ob => {
      this.socket.on('geo_tweet', (data) => {
        // console.log('Received geo tweet');
        ob.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });

    // We define our Observer which will listen to glasgow_tweets
    // from our other components and send glasgow_tweets back to our
    // socket server whenever the `next()` method is called.
    const observer = {
      next: (data: Object) => {
        this.socket.emit('message', JSON.stringify(data));
      },
    };

    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    return Subject.create(observer, observable);
  }

}
