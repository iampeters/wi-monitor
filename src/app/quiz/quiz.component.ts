import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GetQuestionsService } from '../services/get-questions.service';
import { MiscService } from '../services/misc.service';

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

  constructor(
    private router: Router,
    private choice: GetQuestionsService,
    private unset: MiscService
  ) { }

  ngOnInit() {

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
