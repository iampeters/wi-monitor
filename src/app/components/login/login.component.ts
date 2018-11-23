import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from '../../classes/user';
import { MiscService } from '../../services/misc.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  info;
  subscription;

  loginModel = new Login('', '');

  constructor(
    private router: Router,
    private misc: MiscService
  ) { }

  ngOnInit() {
      // login check
      this.misc.isLoggedIn().subscribe( data => {
        if (data.success !== true) {
          this.misc.setLoggedin(false);
        } else {
          this.router.navigate(['/profile']);
          this.misc.setLoggedin(true);
        }
      });
  }

  // Login user
  login(event) {
    const username = event.username;
    const password = event.password;

     this.subscription = this.misc.loginUser(username, password).subscribe(data => {
      if (data.success === true) {

        this.misc.setLoggedin(true);

        this.router.navigate(['/profile']);


      } else {
        this.info = data.message;
      }
    });
  }

  // This will direct user to register view
  register() {
    this.router.navigate(['/register']);
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }

}
