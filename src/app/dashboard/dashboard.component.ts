import { Component, OnInit } from '@angular/core';
import { NewSubject, NewQuestion, NewGuardian } from '../classes/user';
import { MiscService } from '../services/misc.service';
import { SubjectsService } from '../services/subjects.service';
import { AdminLoginService } from '../services/admin-login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  subjectInfo;
  subjectSuccess;
  questionInfo;
  questionSuccess;
  guardianInfo;
  guardianSuccess;

  // new subject model
  subjectModel = new NewSubject('');

  // new question model
  questionModel = new NewQuestion('', 'Choose subject...', '', '', '', '');

  // new guardian model
  guardianModel = new NewGuardian('', '', '', '', '', 'Choose Ward...' );

  public Subjs: any = [];
  public Wards: any = [];

  constructor(
    private misc: MiscService,
    private returned: SubjectsService,
    private admin: AdminLoginService,
    private router: Router
  ) { }

  ngOnInit() {
    // Returning subjects
    this.returned.getSubjects().subscribe( data => {
      this.Subjs = data;
    });

    // Returning the wards
    this.returned.getWards().subscribe( data => {
      this.Wards = data;
    });

    // Checks if the admin is logged in
      this.admin.adminLoginChk().subscribe(data => {
        if (data.success === false) {
          this.router.navigate(['/control']);
        }
      });

  }


  // Get and post subject
  addSubject(event) {
    const subj = event.sub;
    this.misc.addSubject(subj).subscribe(data => {
      // Will do something later
      if (data.success === true) {
        this.subjectSuccess = data.message;
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
        this.questionSuccess = data.message;
      } else {
        this.questionInfo = data.message;
      }
    });
  }

  // Get guardian/parent
  addGuardian(event) {
    const guardian = event.guardian;
    const ward = event.ward;
    const username = event.username;
    const email = event.email;
    const phone = event.phone;
    const relationship = event.relationship;

    this.misc.addGuardian(guardian, ward, relationship, phone, email, username).subscribe( data => {
      if (data.success === true) {
        this.guardianSuccess = data.message;
      } else {
        this.guardianInfo = data.message;
      }
    });
  }

  // Logout
  logout() {
    this.admin.logout().subscribe( data => {
      if (data.success === true) {
        this.router.navigate(['/control']);
      }
    });
  }
}
