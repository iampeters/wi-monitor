import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminLoginService {

  __server = 'http://localhost:3000/';

  constructor( private http: HttpClient ) { }

  // Admin login
  adminLogin(email, password) {
    return this.http.post<MyInterface>(this.__server + 'control', {
      email,
      password
    });
  }

  // Admin login check
  adminLoginChk() {
    return this.http.get<MyInterface>(this.__server + 'adminChk');
  }

  // Admin logout
  logout() {
    return this.http.get<MyInterface>(this.__server + 'admin/logout');
  }
}
export interface MyInterface {
  email: string;
  password: string;
  success: boolean;
  message: string;
}
