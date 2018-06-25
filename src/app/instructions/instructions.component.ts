import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss']
})
export class InstructionsComponent implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {
  }

  agree() {
    this.router.navigate(['quiz']);
  }

  cancel() {
    if (confirm('Are you sure about this?')) {
      // The user window will be closed

    }
  }

}
