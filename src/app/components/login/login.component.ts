import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from '../../classes/user';
import { MiscService } from '../../services/misc.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  info;

  loginModel = new Login('', '');

  constructor(
    private router: Router,
    private misc: MiscService
  ) { }

  ngOnInit() {
  }

  // Login user
  login(event) {
    const username = event.username;
    const password = event.password;

    this.misc.loginUser(username, password).subscribe(data => {
      if (data.success === true) {
        this.router.navigate(['/welcome']);
      } else {
        this.info = data.message;
      }
    });
  }

  // This will direct user to register view
  register() {
    this.router.navigate(['/register']);
  }

}
