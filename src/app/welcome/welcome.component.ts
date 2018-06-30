import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MiscService } from '../services/misc.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor(
    private router: Router,
    private misc: MiscService
  ) { }

  ngOnInit() {
  }
  nextPage() {
    this.router.navigate(['instructions']);
  }

}
