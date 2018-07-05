import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetQuestionsService } from '../services/get-questions.service';
import { MiscService } from '../services/misc.service';
import { Answer } from '../classes/user';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  subject;
  question;
  option1;
  option2;
  option3;
  answer;
  Qid;

  error;
  player;
  opponent;
  wrong = 0;
  right = 0;

  q_count = 10;
  marks = 0;
  time = 15;
  counter = 15;
  expired = 0;

  answerModel = new Answer ('');

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
    this.misc.tagger().subscribe( data => {

      if (data.success === true && data.message === 'resume') {

        // Checking if player 1 is the logged in user
        if (data.player_name === data.loggedInUser) {

          this.player = data.player_name;
          this.opponent = data.opponent_name;
          this.subject = data.subject;
          // alert(data.message);

        } else {

          this.opponent = data.player_name;
          this.player = data.opponent_name;
          this.subject = data.subject;
          // alert(data.message);
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
        alert(data.message);
        this.player = data.username;
        this.subject = data.subject;
      }
    });



  }
  // End of onInit


  // Checking user answer
  userAns(event) {
    const userChoice = event.option;

    if (userChoice === this.answer) {
      if (this.q_count < 1) {
        alert('Game Over' + ' ' + 'Score: ' + this.marks);
      } else {
        this.q_count = this.q_count - 1;
        // Incrementing the score
        this.right = this.right + 1;
        // incrementing the marks
        this.marks = this.marks + 5;

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
          // Incrementing the score
          this.wrong = this.wrong + 1;

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
    if (confirm('are you sure you want to quit the game? Note that your opponent will win')) {
      this.misc.sessionUnset().subscribe(data => {
        if (data.success === true) {
          // Navigates to the home page
          this.router.navigate(['/welcome']);
        }
      });
    }
  }

}
