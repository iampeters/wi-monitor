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
    const observable = new Observable(observer => {
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
    const observable = new Observable(observer => {
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
    const observable = new Observable( observer => {
      this.socket.on('needed', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;

  }

  // parent chatter
  parentChatter() {
    this.socket.emit('parent-chatter', 'hi');

    // get socket response
    const observable = new Observable( observer => {
      this.socket.on('parent-chatter', (data) => {
        observer.next(data);
      });
        return () => {
          this.socket.disconnect();
        };
    });
    return observable;
  }

  // vGameOver
  vGameOver() {
    this.socket.emit('vGameOver', 'hi');

    // get socket response
    const observable = new Observable( observer => {
      this.socket.on('vGameOver', (data) => {
        observer.next(data);
      });
        return () => {
          this.socket.disconnect();
        };
    });
    return observable;
  }

  // quiz GameOver
  gameOver() {
    this.socket.emit('GameOver', 'hi');

    // get socket response
    const observable = new Observable( observer => {
      this.socket.on('GameOver', (data) => {
        observer.next(data);
      });
        return () => {
          this.socket.disconnect();
        };
    });
    return observable;
  }

  // vQues
  vQues() {
    this.socket.emit('vQues', 'hi');

    // get socket response
    const observable = new Observable( observer => {
      this.socket.on('vQues', (data) => {
        observer.next(data);
      });
        return () => {
          this.socket.disconnect();
        };
    });
    return observable;
  }

  // getViewersAnswers
  getViewersAnswers() {
    this.socket.emit('getViewerAns', 'hi');

    // get socket response
    const observable = new Observable( observer => {
      this.socket.on('getViewerAns', (data) => {
        observer.next(data);
      });
        return () => {
          this.socket.disconnect();
        };
    });
    return observable;
  }

  // getViewersAnswers
  getAnswers() {
    this.socket.emit('getAnswers', 'hi');

    // get socket response
    const observable = new Observable( observer => {
      this.socket.on('getAnswers', (data) => {
        observer.next(data);
      });
        return () => {
          this.socket.disconnect();
        };
    });
    return observable;
  }

  // getLiveData
  getLiveData(id) {
    this.socket.emit('getLiveData', id);

    // get socket response
    const observable = new Observable( observer => {
      this.socket.on('getLiveData', (data) => {
        observer.next(data);
      });
        return () => {
          this.socket.disconnect();
        };
    });
    return observable;
  }

  // getLiveAns
  getLiveAns() {
    this.socket.emit('getLiveAns', 'id');

    // get socket response
    const observable = new Observable( observer => {
      this.socket.on('getLiveAns', (data) => {
        observer.next(data);
      });
        return () => {
          this.socket.disconnect();
        };
    });
    return observable;
  }

  // get questions
  // i will rename the below method when i know the component
  // that requires it
  getQuestions() {
    this.socket.emit('getQues', 'hello socket');

    // get socket response
    const observable = new Observable( observer => {
      this.socket.on('getQues', (data) => {
        observer.next(data);
      });
        return () => {
          this.socket.disconnect();
        };
    });
    return observable;
  }

  // get questions
  getQues() {
    this.socket.emit('getQuizQues', 'hello socket');

    // get socket response
    const observable = new Observable( observer => {
      this.socket.on('getQuizQues', (data) => {
        observer.next(data);
      });
        return () => {
          this.socket.disconnect();
        };
    });
    return observable;
  }

  // getter
  getter() {
    this.socket.emit('getter', 'hello socket');

    // get socket response
    const observable = new Observable( observer => {
      this.socket.on('getter', (data) => {
        observer.next(data);
      });
        return () => {
          this.socket.disconnect();
        };
    });
    return observable;
  }

  // getP1Scores
  getP1Scores() {
    this.socket.emit('scoreUpdate', 'hello socket');

    // get socket response
    const observable = new Observable( observer => {
      this.socket.on('scoreUpdate', (data) => {
        observer.next(data);
      });
        return () => {
          this.socket.disconnect();
        };
    });
    return observable;
  }

  // getP2Scores
  getOpp() {
    this.socket.emit('getP2Scores', 'hello socket');

    // get socket response
    const observable = new Observable( observer => {
      this.socket.on('getP2Scores', (data) => {
        observer.next(data);
      });
        return () => {
          this.socket.disconnect();
        };
    });
    return observable;
  }

  // getViewers
  getViewers() {
    this.socket.emit('getViewers', 'hello socket');

    // get socket response
    const observable = new Observable( observer => {
      this.socket.on('getViewers', (data) => {
        observer.next(data);
      });
        return () => {
          this.socket.disconnect();
        };
    });
    return observable;
  }

  // chatter
  chatter() {
    this.socket.emit('chatter', 'hi');

    // get socket response
    const observable = new Observable( observer => {
      this.socket.on('chatter', (data) => {
        observer.next(data);
      });
        return () => {
          this.socket.disconnect();
        };
    });
    return observable;
  }


}
