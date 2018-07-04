import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MiscService } from '../../services/misc.service';
import { Register } from '../../classes/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  info;

  registerModel = new Register('', '', '');

  constructor(
    private router: Router,
    private misc: MiscService
  ) { }

  ngOnInit() {
    this.misc.isLoggedIn().subscribe(data => {
      if (data.success === true) {
        this.router.navigate(['/welcome']);
      }
    });
  }

  // New user registration
  register(event) {
    const target = event.target;
    const fname = target.querySelector('#materialFormRegisterFnameEx').value;
    const username = target.querySelector('#materialFormRegisterUsernameEx').value;
    const password = target.querySelector('#materialFormLoginPasswordEx').value;

    this.misc.registerUser(fname, username, password).subscribe(data => {
      // Will do someting here
      if (data.success === true) {
        this.info = data.message;
      } else {
        this.info = data.message;
      }
    });

  }

  // Login
  login() {
    this.router.navigate(['/login']);
  }

}
