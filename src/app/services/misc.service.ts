import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MyInt } from './get-questions.service';

@Injectable({
  providedIn: 'root'
})
export class MiscService {

  url = '/wi-monitor/src/app/api/get/sessionUnset.php';
  regUrl = '/wi-monitor/src/app/api/user/register.php';
  loginUrl = '/wi-monitor/src/app/api/user/login.php';
  logoutUrl = '/wi-monitor/src/app/api/user/logout.php';
  useChkUrl = '/wi-monitor/src/app/api/user/userCheck.php';

  constructor( private http: HttpClient ) { }

  // unset subject session variable
  sessionUnset() {
    return this.http.get<Myface>(this.url);
  }

  // Register a new user
  registerUser(fname, username, password) {
    return this.http.post<Myface>(this.regUrl, {
      fname,
      username,
      password
    });
  }

  // Login user
  loginUser(username, password) {
    return this.http.post<Myface>(this.loginUrl, {
      username,
      password
    });
  }

  // Logout user
  logoutUser() {
    return this.http.get<Myface>(this.logoutUrl);
  }

  // Check which user isLoggedIn
  userCheck() {
    return this.http.get<Myface>(this.useChkUrl);
  }
}
export interface Myface {
  success: boolean;
  fullname: string;
  username: string;
  password: string;
  message: string;
}
