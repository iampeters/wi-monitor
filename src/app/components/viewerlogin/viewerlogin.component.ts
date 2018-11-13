import { Component, OnInit } from '@angular/core';
import { ViewersLogin } from '../../classes/user';
import { Router } from '@angular/router';
import { MiscService } from '../../services/misc.service';

@Component({
  selector: 'app-viewerlogin',
  templateUrl: './viewerlogin.component.html',
  styleUrls: ['./viewerlogin.component.scss']
})
export class ViewerloginComponent implements OnInit {

  loginModel = new ViewersLogin('', '');

  // varibles
  loginFalse;

  constructor(
    private http: Router,
    private misc: MiscService
  ) { }

  ngOnInit() {
    // Checks if the parent isLoggedIn
    this.misc.isParentLoggedIn().subscribe( data => {
      if (data.success === true) {
        this.http.navigate(['gid']);
      }
    });
  }

  login(e) {
    const username = e.username;
    const ward = e.ward;

    this.misc.guardianLogin(username, ward).subscribe( data => {
      if (data.success === true) {
        this.http.navigate(['/gid']);
      } else {
        this.loginFalse = data.message;
      }

    });
  }
}
