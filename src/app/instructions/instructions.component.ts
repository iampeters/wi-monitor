import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SubjectsService } from '../services/subjects.service';
import { QuestionsService } from '../services/questions.service';
import { MiscService } from '../services/misc.service';


@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss']
})

export class InstructionsComponent implements OnInit, OnDestroy {

  public subjects: any = [];
  sub;
  subjectChosen;
  error;
  subscription;

  constructor(
    private router: Router,
    private returned: SubjectsService,
    private question: QuestionsService,
    private misc: MiscService
  ) { }

  public getSub() {
  }

  ngOnInit() {

    // check if user is logged in
      this.misc.isLoggedIn().subscribe( data => {
      if (data.success !== true) {
        this.misc.setLoggedin(false);
        this.router.navigate(['/login']);
      }
    });

    // Getting available subjects
    // this.returned.getSubjects().subscribe(data => {
    //   this.subjects = data;
    // });
    // this.getSub();
    this.subscription = this.returned.getSubjects().subscribe(data => {
      this.subjects = data;
    });
  }

  ngOnDestroy(): void {
    // some code...
    this.subscription.unsubscribe();
  }



  // this fucntion will be executed on form submit
  onSubmit(event) {
    this.sub = event.group;

    this.question.getQuestions(this.sub).subscribe(data => {
      if (data.success === true) {

        this.subjectChosen = data.message;

        this.router.navigate(['/quiz']);


      } else {
        this.error = data.message;
      }
    });

    return false;
  }

  // // this function will redirect to some other link
  cancel() {
    if (confirm('Are you sure about this?')) {
      // The user window will be closed
      this.misc.logoutUser().subscribe(data => {
        this.router.navigate(['/login']);
      });

    }
  }

}
