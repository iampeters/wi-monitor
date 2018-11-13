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
    const observable = new Observable<Activity>(observer => {
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
    const observable = new Observable<Chatter[]>( observer => {
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

  // // getViewersAnswers
  // getViewersAnswers() {
  //   this.socket.emit('getQuizAns', 'hi');

  //   // get socket response
  //   const observable = new Observable<Myface>( observer => {
  //     this.socket.on('getQuizAns', (data) => {
  //       observer.next(data);
  //     });
  //       return () => {
  //         this.socket.disconnect();
  //       };
  //   });
  //   return observable;
  // }

  // getViewersAnswers
  getViewersAnswers() {
    this.socket.emit('getViewerAns', 'hi');

    // get socket response
    const observable = new Observable<Myface>( observer => {
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
    const observable = new Observable<Myface>( observer => {
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
    const observable = new Observable<Myface>( observer => {
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
    const observable = new Observable<Data>( observer => {
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
    const observable = new Observable<Data>( observer => {
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
    const observable = new Observable<Data>( observer => {
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
    const observable = new Observable<Chatter[]>( observer => {
      this.socket.on('chatter', (data) => {
        observer.next(data);
      });
        return () => {
          this.socket.disconnect();
        };
    });
    return observable;
  }

  send(message) {
      this.socket.emit('test', message);
      // get socket response
      const observable = new Observable<Data>( observer => {
        this.socket.on('test', (data) => {
          observer.next(data);
        });
          return () => {
            this.socket.disconnect();
          };
      });
      return observable;
  }

  taggerSession(game_id, session_key, tag_id) {

    const data = {
      game_id : game_id,
      session_key: session_key,
      tag_id: tag_id
    };

    // emit socket
    this.socket.emit('tagger-session', data);
  }



}

export interface Data {
  p_correct: string;
  p_scores: string;
  p_wrong: string;
  subject: string;
  p2_name: string;
  p_name: string;
  p_questions: string;
  o_questions: any;
  o_scores: number;
  o_wrong: number;
  o_correct: number;
  question: string;
  p1_turn: number;
  p2_turn: number;
  viewers: number;
  success: boolean;
  opponent: number;
  message: string;

  // Options from the set question
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}

export interface Myface {
  success: boolean;
  fullname: string;
  username: string;
  password: string;
  message: string;
  guardian: string;
  subject: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: string;
  question: string;
  ward: string;
  question_id: number;
}

export interface Chatter {
  success: boolean;
  mid: number;
  sender: string;
  receiver: string;
  message: string;
}

export interface Game {
  session_key: string;
  success: boolean;
  message: string;
}

export interface Activity {
  success: boolean;
  opponent: string;
  player: string;
  subject: string;
  p_correct: number;
  p_wrong: number;
  p_scores: number;
  o_correct: number;
  o_wrong: number;
  o_scores: number;
  p_username: string;
  o_username: string;
  o_fullname: string;
  p_fullname: string;
  viewers: number;
  o_count: any;
  p_count: number;
  p_turn: number;
  o_turn: number;
  p_questions: number;
  o_questions: any;
}

export interface GameOver {
  player: string;
  opponent: string;
}

export interface Points {
  userid: number;
  username: string;
  points: number;
  wins: number;
  losses: number;
  draws: number;
  id: number;
  level: number;
}

export interface Log {
  username: string;
  password: string;
}

export interface Tagger {
  success: boolean;
  message: string;
  data: string;
  game_id: number;
  tag_id: number;
  subject_id: number;
  subject: string;
  player_id: number;
  opponent_id: number;
  session_key: string;
  player_name: string;
  opponent_name: string;
  loggedInUser: string;
  username: string;
  wrong: number;
  right: number;
  value: number;
  scores: number;
  msg: boolean;
  time: number;
}
