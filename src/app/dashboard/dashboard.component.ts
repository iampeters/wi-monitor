import { Component, OnInit } from '@angular/core';
import { NewSubject, NewQuestion, NewGuardian } from '../classes/user';
import { MiscService } from '../services/misc.service';
import { SubjectsService } from '../services/subjects.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  subjectInfo;
  questionInfo;
  guardianInfo;

  // new subject model
  subjectModel = new NewSubject('');

  // new question model
  questionModel = new NewQuestion('', 'Choose subject...', '', '', '', '');

  // new guardian model
  guardianModel = new NewGuardian('', '');

  public Subjs = [];

  constructor(
    private misc: MiscService,
    private returned: SubjectsService
  ) { }

  ngOnInit() {
    // Returning subjects
    this.returned.getSubjects().subscribe(data => {
      this.Subjs = data;
    });
  }


  // Get and post subject
  addSubject(event) {
    const subj = event.sub;
    this.misc.addSubject(subj).subscribe(data => {
      // Will do something later
      if (data.success === true) {
        this.subjectInfo = data.message;
      } else {
        this.subjectInfo = data.message;
      }
    });
  }

  // Get question
  addQuestion(event) {
    const question = event.question;
    const subject = event.subject;
    const option1 = event.option1;
    const option2 = event.option2;
    const option3 = event.option3;
    const answer = event.answer;

    this.misc.addQuestion(question, subject, option1, option2, option3, answer).subscribe(data => {
      if (data.success === true) {
        this.questionInfo = data.message;
      } else {
        this.questionInfo = data.message;
      }
    });
  }

  // Get guardian/parent
  addGuardian(event) {
    const guardian = event.guardian;
    const ward = event.ward;

    console.log(guardian, ward);
  }
}
