import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { GetQuestionsService } from '../services/get-questions.service';
import { MiscService } from '../services/misc.service';
import { Answer, Chat } from '../classes/user';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  providers: [SocketService]
})

export class QuizComponent implements OnInit {


  subject;
  public question;
  Qid;
  isMerged;
  msg;
  turn;
  viewers;
  empty;

  error;
  player;
  opponent;
  wrong = 0;
  right = 0;

  opp;
  p1;
  // player 1 Variables
  p_correct;
  p_scores;
  p_wrong;
  p_questions;
  // player 2 Variables
  o_correct;
  o_scores;
  o_wrong;
  o_questions;

  q_count = 10;
  marks = 0;
  p_time = 30;
  o_time = 30;
  counter = 15;
  expired = 0;
  public chats: any = [];
  GameOver;

  // options
  option1;
  option2;
  option3;
  option4;

  answerModel = new Answer('');
  chatModel = new Chat('', '');

  constructor(
    private router: Router,
    private choice: GetQuestionsService,
    private misc: MiscService,
    private socket: SocketService
  ) { }


  ngOnInit() {
    // Checking if there is a loggedIn user
    this.misc.isLoggedIn().subscribe( data => {
      if (data.success !== true) {
        this.misc.setLoggedin(false);
        this.router.navigate(['/login']);
      }
    });

    // Checking if there is an active subject
    this.choice.getSubject().subscribe(data => {

      if (data.success === false) {
        this.router.navigate(['/welcome']);
      }
    });

    // This will check if game of the user subject has an active session or is waiting to be merged
    this.misc.tagger().subscribe(data => {

      if (data.success === true && (data.message === 'resume' || data.message === 'start')) {

        this.isMerged = true;

        // Checking if player 1 is the logged in user
        if (data.player_name === data.loggedInUser) {

          this.player = data.player_name;
          this.opponent = data.opponent_name;
          this.subject = data.subject;

        } else {

          this.opponent = data.player_name;
          this.player = data.opponent_name;
          this.subject = data.subject;
        }

        // Getting questions from user preferred subject
        this.socket.getQuestions().subscribe();

        // the below will set the sessions
        const session_key = data.session_key,
              tag_id = data.tag_id,
              game_id = data.game_id;

        this.socket.taggerSession(game_id, session_key, tag_id);
        // the above will set the sessions

      } else {
        // alert(data.message);
        this.player = data.username;
        this.subject = data.subject;
        this.isMerged = false;
        this.msg = data.message;

      }
    });
  }
  // End of onInit

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    // Get questions

    setInterval(() => {
      // getting answers
      this.socket.getViewersAnswers().subscribe(data3 => {
       //  this.choices = data3;
        this.option1 = data3[0].answer;
        this.option2 = data3[1].answer;
        this.option3 = data3[2].answer;
        this.option4 = data3[3].answer;

      });

       this.socket.getQues().subscribe(data => {
        this.question = data.question;
        // console.log(data);
      });
    }, 2000);

   setInterval(() => {

    //  Game over
     if (this.q_count < 1) {

     }

     // Game Over
     this.socket.gameOver().subscribe(data => {
       // this.GameOver = data;
       // console.log(data);
     });

   }, 1000);

    // if (this.isMerged === true) {
      const chatArea = document.getElementById('area');

      // Getting the current player
      const getter = setInterval(() => {
        this.socket.getter().subscribe(data => {
          if (data.success === true) {
            this.turn = true;

          } else {
            this.turn = false;
          }
        });

      }, 1000);

      const score = setInterval(() => {
        // Get player one scores
        this.socket.getP1Scores().subscribe( data => {
          this.p1 = data;
          this.p_correct = data.p_correct;
          this.p_scores = data.p_scores;
          this.p_wrong = data.p_wrong;
          this.p_questions = data.p_questions;
        });

        // Get player two scores
        this.socket.getOpp().subscribe(data5 => {
          this.o_correct = data5.o_correct;
          this.o_wrong = data5.o_wrong;
          this.o_questions = data5.o_questions;
          this.o_scores = data5.o_scores;
        });
        // clearInterval(score);
      }, 2000);

      // Getting viewers
      setInterval(() => {
        this.socket.getViewers().subscribe(data => {
          this.viewers = data.viewers;
          // console.log(data);
        });

        // Getting the chat
        this.socket.chatter().subscribe(data => {

          this.chats = data;
          // console.log(data);

        });

      }, 1000);

      // player 1 Timer
      //  if (this.isMerged === true ) {
      const p_timer = setInterval(() => {
        if (this.p_time === 2) {

          // This will switch turns between players
          // this.misc.setter().subscribe();
        }

        if (this.p_time === 1) {
          // Getting new question
          // this.choice.generator().subscribe(data => {
          //   if (data.success === true) {
          //     this.question = data.question;

          //   } else {
          //     console.log(data.message);
          //   }
          // });


          // // getting answers
          // this.socket.getViewersAnswers().subscribe(data3 => {
          //   this.choices = data3;
          // });
        }

        if (this.p_time === 0) {
          // clearInterval(p_timer);

          // const userChoice = 'slfdosdld;ljlsd';
          // // Checks for correct answer
          // this.misc.chkAnswer(userChoice).subscribe(data4 => {
          //   if (data4.success === true && data4.message === 'Correct') {
          //     this.right = data4.value;
          //     this.marks = data4.scores;

          //   } else if (data4.success === true && data4.message === 'Wrong') {
          //     this.wrong = data4.value;

          //   } else {
          //     // <3
          //   }

          // });

          this.o_time = 30;
          this.p_time = 30;

        } else {
          this.p_time -= 1;
          this.o_time -= 1;
        }
      }, 1000);
  //  } else {
  //    this.o_time = 0;
  //    this.p_time = 0;
  //  }

    // }

  }


  // Checking user answer

  userAns(event) {
    const userChoice = event.option;

   if (this.q_count < 1 ) {
      // Game over
      const gameOver = document.getElementById('game-over');
      const quizWrapper = document.getElementById('quiz-wrapper');

      gameOver.style.display = 'block';
      quizWrapper.style.display = 'none';

   } else {

     // Set player 2 time
     this.o_time = 15;
     this.p_time = 15;

     // Decrement question count
     this.q_count = this.q_count - 1;
     this.misc.quesDec().subscribe();

     // Checks for correct answer
     this.misc.chkAnswer(userChoice).subscribe(data4 => {

       if (data4.success === true && data4.message === 'Correct') {
          // this.right = data4.value;
          // this.marks = data4.scores;
          console.log(data4);

       } else if (data4.success === true && data4.message === 'Wrong') {
          // this.wrong = data4.value;
          console.log(data4);

       } else {
        // <3
       }

     });

     // Getting new question
     this.choice.generator().subscribe();

     // This will switch turns between players
    this.misc.setter().subscribe();

     // getting answers
     this.socket.getViewersAnswers().subscribe(data3 => {
       this.option1 = data3[0].answer;
       this.option2 = data3[1].answer;
       this.option3 = data3[2].answer;
       this.option4 = data3[3].answer;
     });

   }

  }

  quit() {
    if (confirm('Are you sure? If you quit you will loose the game')) {
      this.misc.sessionUnset().subscribe(data => {
        if (data.success === true) {
          // Navigates to the home page
          this.router.navigate(['/welcome']);
        }
      });
    }
  }

  // Skip
  skip() {
    // This will generate a new question for the user
    this.choice.generator().subscribe();

    // getting answers
    this.socket.getViewersAnswers().subscribe(data3 => {
       this.option1 = data3[0].answer;
       this.option2 = data3[1].answer;
       this.option3 = data3[2].answer;
       this.option4 = data3[3].answer;
    });


    const btn = <HTMLInputElement>document.getElementById('btn');
    // btn.setAttribute('disabled', 'disabled')
    btn.disabled = true;
  }

  // LifeLIne
  life() {
    // Ask for help
    const chat = document.getElementById('chat');
    chat.style.display = 'block';

    const open = true;
    this.misc.open(open).subscribe();

    // This will disable the button once it is clicked
    const btn = document.getElementById('life');
    btn.setAttribute('disabled', 'disabled');


  }
  // Close chat
  close() {
    const chat = document.getElementById('chat');
    chat.style.display = 'none';
    const close = true;

    this.misc.close(close).subscribe();
  }

  // chat
  chat(e) {
    const txt = e.txt;
    if (txt === '') {
      this.empty = 'Please ask a question';

    } else {

      this.misc.chat(txt).subscribe();
    }
  }

}
