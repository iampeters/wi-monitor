import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private url = 'http://localhost:3000';
  private socket = io.connect(this.url);

  constructor( ) {
  }

  // send a message to socket
  message(msg) {
    // send msg
    this.socket.emit('chat', msg);

    // get server response
    let observable = new Observable(observer => {
      this.socket.on('chat', (data) => {
        observer.next(JSON.parse(data));
      });

      return () => {
        this.socket.disconnect();
      };

    });
    return observable;
  }

  // initialized
  viewerInit() {
    // send msg
    this.socket.emit('vInit', 'hi');

    // get server response
    let observable = new Observable(observer => {
      this.socket.on('vInit', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };

    });
    return observable;
  }

  // Needed
  needed() {
    // send msg
    this.socket.emit('needed', 'hi');

    // get server response
    let observable = new Observable( observer => {
      this.socket.on('needed', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      }
    });
    return observable;

  }

  // parent chatter
  parentChatter() {
    this.socket.emit('parent-chatter', 'hi');

    // get socket response
    let observable = new Observable( observer => {
      this.socket.on('parent-chatter', (data) => {
        observer.next(data);
      });
        return () => {
          this.socket.disconnect();
        }
    });
    return observable;
  }

  // vGameOver
  vGameOver() {
    this.socket.emit('vGameOver', 'hi');

    // get socket response
    let observable = new Observable( observer => {
      this.socket.on('vGameOver', (data) => {
        observer.next(data);
      });
        return () => {
          this.socket.disconnect();
        }
    });
    return observable;
  }

  // vQues
  vQues() {
    this.socket.emit('vQues', 'hi');

    // get socket response
    let observable = new Observable( observer => {
      this.socket.on('vQues', (data) => {
        observer.next(data);
      });
        return () => {
          this.socket.disconnect();
        }
    });
    return observable;
  }

  // getViewersAnswers
  getViewersAnswers() {
    this.socket.emit('getViewerAns', 'hi');

    // get socket response
    let observable = new Observable( observer => {
      this.socket.on('getViewerAns', (data) => {
        observer.next(data);
      });
        return () => {
          this.socket.disconnect();
        }
    });
    return observable;
  }

  // getLiveData
  getLiveData(id) {
    this.socket.emit('getLiveData', id);

    // get socket response
    let observable = new Observable( observer => {
      this.socket.on('getLiveData', (data) => {
        observer.next(data);
      });
        return () => {
          this.socket.disconnect();
        }
    });
    return observable;
  }

  // getLiveAns
  getLiveAns() {
    this.socket.emit('getLiveAns', id);

    // get socket response
    let observable = new Observable( observer => {
      this.socket.on('getLiveAns', (data) => {
        observer.next(data);
      });
        return () => {
          this.socket.disconnect();
        }
    });
    return observable;
  }


}
