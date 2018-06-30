import { Component, OnInit } from '@angular/core';
import { AdminLoginService } from '../services/admin-login.service';
import { User } from '../classes/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit {

  userModel = new User('', '');
  public info;

  constructor( private admin: AdminLoginService, private router: Router ) { }

  ngOnInit() {
  }

  login(e) {
    e.preventDefault();
    const target = e.target;

    const email = target.querySelector('#materialFormLoginEmailEx').value;
    const password = target.querySelector('#materialFormLoginPasswordEx').value;

    this.admin.adminLogin(email, password).subscribe(data => {
      if (data.success === true) {
        // login user
        this.router.navigate(['dashboard']);
      } else {
        // display error message
        // this.info = data.message;
        window.alert(data.message);
      }
    });
    // console.log(email, password);

  }

}
