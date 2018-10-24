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
    // Checking if user is logged in
      this.misc.isLoggedIn().subscribe( data => {
      if (data.success !== true) {
        this.misc.setLoggedin(false);
        this.router.navigate(['/login']);
      }
    });
  }
  nextPage() {
    this.router.navigate(['instructions']);
  }

}
