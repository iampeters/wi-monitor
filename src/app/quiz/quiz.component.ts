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
    private unset: MiscService
  ) { }

  ngOnInit() {

    if (this.q_count < 1) {
      alert('Game Over' + ' ' + 'Score: ' + this.marks);
    }

    // Countdown
    // setInterval(() => {
    //   this.time = this.counter;
    //   this.time = this.time  - 1;
    // }, 1000);

    // Getting user preferred subject
    this.choice.getSubject().subscribe(data => {
      if (data.success === true) {
        this.subject = data.Subject;
      } else {
        this.router.navigate(['/welcome']);
      }
    });

    // Getting questions from user preferred subject
    this.choice.getQuestions().subscribe(data => {
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

    // Getting player details
    this.unset.userCheck().subscribe(data => {
      this.player = data.username;
    });
  }

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
      this.unset.sessionUnset().subscribe(data => {
        if (data.success === true) {
          // Navigates to the home page
          this.router.navigate(['/welcome']);
        }
      });
    }
  }

}
