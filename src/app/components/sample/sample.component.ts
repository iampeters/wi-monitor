import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MiscService } from '../../services/misc.service';
import { Login } from '../../classes/user';


@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss']
})
export class SampleComponent implements OnInit {

loginModel = new Login('', '');

log: any;

users = [];
fullname;
truty = false;

  constructor(
    private router: Router,
    private misc: MiscService
  ) { }

  ngOnInit() {
    // setInterval(() => {
      // this.misc.getallusers().subscribe(data => {
      //   this.users = data;
      // })
    // }, 2000)
  }

   login(event) {
      const username = event.username;
      const password = event.password;

      this.misc.postlogin(username, password).subscribe(data => {
       
        this.fullname = data.fullname;
        this.truty = true;
      })
     // console.log(event);
    }

    view_password() {
      const input = document.getElementById('password'),
            eye = document.getElementById('toggleView');

      if(input.attributes['type'].value === 'password') {
        input.setAttribute('type', 'text');
        eye.innerHTML = '<i class="fa fa-eye"></i>';

      } else if (input.attributes['type'].value === 'text'){
        input.setAttribute('type', 'password');
        eye.innerHTML = '<i class="fa fa-eye-slash"></i>';

      } else {
        input.setAttribute('type', 'password');
        eye.innerHTML = '<i class="fa fa-eye-slash"></i>';
      }
    }
}
