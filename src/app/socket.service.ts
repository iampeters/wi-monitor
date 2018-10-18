import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private url = 'http://localhost:3000';
  private socket$ = io(this.url);
  ws = io;

  // send a message to socket
  message( msg ) {
    // send msg
    this.ws.emit('chat', msg);

    // get server response
    const observable = new Observable(observer => {
      this.socket$.on('chat', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket$.disconnect();
      };

    });
    return observable;
  }

  chat(msg) {
    this.ws.emit('chat', msg);

    // let observable
  }
}
