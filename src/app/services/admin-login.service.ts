import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminLoginService {

  url = '/wi-monitor/src/app/api/user/adminLogin.php';
  adminChkUrl = '/wi-monitor/src/app/api/user/adminChk.php';
  logoutUrl = '/wi-monitor/src/app/api/user/adminLogout.php';

  constructor( private http: HttpClient ) { }

  // Admin login
  adminLogin(email, password) {
    return this.http.post<MyInterface>(this.url, {
      email,
      password
    });
  }

  // Admin login check
  adminLoginChk() {
    return this.http.get<MyInterface>(this.adminChkUrl);
  }

  // Admin logout
  logout() {
    return this.http.get<MyInterface>(this.logoutUrl);
  }
}
export interface MyInterface {
  email: string;
  password: string;
  success: boolean;
  message: string;
}
