import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminLoginService {

  url = '/wi-monitor/src/app/api/adminLogin.php';

  constructor( private http: HttpClient ) { }

  adminLogin(email, password) {
    return this.http.post<MyInterface>(this.url, {
      email,
      password
    });
  }
}
export interface MyInterface {
  email: string;
  password: string;
  success: boolean;
  message: string;
}
