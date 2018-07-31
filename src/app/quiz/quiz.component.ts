import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
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

  @ViewChild('qBoard') qBoard: ElementRef;

  subject;
  public question;
  option1;
  option2;
  option3;
  answer;
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

  q_count = 10;
  marks = 0;
  time;
  counter = 15;
  expired = 0;
  chats = [];

  answerModel = new Answer('');
  chatModel = new Chat('', '');

  constructor(
    private router: Router,
    private choice: GetQuestionsService,
    private misc: MiscService
  ) { }


  ngOnInit() {
    // Checking if there is a loggedIn user
    this.misc.userCheck().subscribe(data => {

      if (data.success === false) {
        // return to login page if the user is not logged in
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
        this.choice.getQuestions().subscribe(data1 => {
          if (data1.success === true) {
            this.question = data1.question;
            this.option1 = data1.option1;
            this.option2 = data1.option2;
            this.option3 = data1.option3;
            this.answer = data1.answer;
          } else {
            this.error = data1.message;
          }
        });

      } else {
        // alert(data.message);
        this.player = data.username;
        this.subject = data.subject;
        this.isMerged = false;
        this.msg = data.message;
        this.time = 0;

      }
    });



  }
  // End of onInit

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {

    const chatArea = document.getElementById('area');

    // Getting the current player
    const getter = setInterval(() => {
      this.misc.getter().subscribe(data => {
        if (data.success === true && data.msg === true) {
          this.turn = true;

          // This will get the current time
          // this.misc.getTime().subscribe(data1 => {
          //   if (data1.success === true) {
          //     this.time = data1.time;
          //   }
          // });

        } else {
          this.turn = false;
          this.time = 0;
        }
      });

    }, 1000);

    // Getting viewers
    setInterval(() => {
      this.misc.getViewers().subscribe(data => {
        this.viewers = data.message;
      });

      // Getting the chat
      this.misc.chatter().subscribe( data => {

        this.chats = data;

      });

    }, 1000);

  }


  // Checking user answer
  userAns(event) {
    const userChoice = event.option;

    // This will switch turns between players
    this.misc.setter().subscribe();

    // This will set the user timer
    this.misc.timer().subscribe();

    // I stopped here. i will remove this when i come back
    // this.misc.getTime().subscribe(data2 => {
    //   if (data2.success === true) {
    //     this.time = data2.time;
    //     // console.log(data2.time);
    //   }
    // });

    if (userChoice === this.answer) {
      if (this.q_count < 1) {
        alert('Game Over' + ' ' + 'Score: ' + this.marks);
      } else {
        this.q_count = this.q_count - 1;

        const score = 1;

        // Inserting into scores table when the user picked the correct answer
        this.misc.ansCorrect(score).subscribe(data => {
          if (data.success === true) {
            this.right = data.value;
            // incrementing the marks
            this.marks = data.scores;
          }
        });

        this.choice.generator().subscribe(data => {
          if (data.success === true) {
            this.question = data.question;
            this.option1 = data.option1;
            this.option2 = data.option2;
            this.option3 = data.option3;
            this.answer = data.answer;
          } else {
            this.error = data.message;
          }
        });
      }

    } else {
      if (this.q_count < 1) {
        alert('Game Over' + ' ' + 'Score: ' + this.marks);
      } else {
        this.q_count = this.q_count - 1;

        const score = 1;

        // Inserting into scores table when the user picked the wrong answer
        this.misc.ansWrong(score).subscribe(data => {
          if (data.success === true) {
            this.wrong = data.value;
          }
        });

        this.choice.generator().subscribe(data => {
          if (data.success === true) {
            this.question = data.question;
            this.option1 = data.option1;
            this.option2 = data.option2;
            this.option3 = data.option3;
            this.answer = data.answer;
          } else {
            this.error = data.message;
          }
        });
      }
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
    this.choice.generator().subscribe(data => {
      if (data.success === true) {
        this.question = data.question;
        this.option1 = data.option1;
        this.option2 = data.option2;
        this.option3 = data.option3;
        this.answer = data.answer;
      } else {
        // If there are errors
        this.error = data.message;
      }
    });
  }

  // LifeLIne
  life() {
    const e = this.question;
    // this.choice.chat(e).subscribe( data => {})
    const chat = document.getElementById('chat');
    chat.style.display = 'block';
    const open = true;
    this.misc.open(open).subscribe();
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
