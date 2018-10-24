import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { GetQuestionsService } from '../services/get-questions.service';
import { MiscService } from '../services/misc.service';
import { Answer, Chat } from '../classes/user';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
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
  o_scores = 0;
  o_correct = 0;
  o_wrong = 0;
  wrong = 0;
  right = 0;

  opp = [];
  p1 = [];

  q_count = 10;
  marks = 0;
  p_time = 30;
  o_time = 30;
  counter = 15;
  expired = 0;
  public chats = [];
  public choices = [];
  GameOver;

  answerModel = new Answer('');
  chatModel = new Chat('', '');

  constructor(
    private router: Router,
    private choice: GetQuestionsService,
    private misc: MiscService
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
        this.choice.getQuestions().subscribe();

        // getting answers
        this.misc.getAnswers().subscribe( data3 => {
          this.choices = data3;
        });

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
     this.misc.getQues().subscribe(data => {
       this.question = data.question;
     });

     // getting answers
     this.misc.getAnswers().subscribe(data3 => {
       this.choices = data3;
     });

    //  Game over
     if (this.q_count < 1) {

     }

     // Game Over
     this.misc.gameOver().subscribe(data => {
       this.GameOver = data;
     });

   }, 1000);

    // if (this.isMerged === true) {
      const chatArea = document.getElementById('area');

      // Getting the current player
      const getter = setInterval(() => {
        this.misc.getter().subscribe(data => {
          if (data.success === true && data.msg === true) {
            this.turn = true;

          } else {
            this.turn = false;

          }
        });

        // Get player one scores
        this.misc.getP1Scores().subscribe( data => {
          this.p1 = data;
        });

        // Get player two scores
        this.misc.getOpp().subscribe(data5 => {
          this.opp = data5;
        });

      }, 1000);

      // Getting viewers
      setInterval(() => {
        this.misc.getViewers().subscribe(data => {
          this.viewers = data.message;
        });

        // Getting the chat
        this.misc.chatter().subscribe(data => {

          this.chats = data;

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
          // this.misc.getAnswers().subscribe(data3 => {
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
          this.right = data4.value;
          this.marks = data4.scores;

       } else if (data4.success === true && data4.message === 'Wrong') {
          this.wrong = data4.value;

       } else {
        // <3
       }

     });

     // Getting new question
     this.choice.generator().subscribe();

     // This will switch turns between players
    this.misc.setter().subscribe();

     // getting answers
     this.misc.getAnswers().subscribe(data3 => {
       this.choices = data3;
     });

   }

    // This will set the user timer
    // this.misc.timer().subscribe();
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
    this.misc.getAnswers().subscribe(data3 => {
      this.choices = data3;
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
