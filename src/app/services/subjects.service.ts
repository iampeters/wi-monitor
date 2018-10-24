import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SubjectsService {
  __server = 'http://localhost:3000/';

  constructor( private http: HttpClient ) { }

  // Getting subjects
  getSubjects() {
    return this.http.get<Data[]>(this.__server + 'subjects');
  }

  // Getting wards
  getWards() {
    return this.http.get<Data[]>(this.__server + 'wards');
  }

}

export interface Data {
  subject: string;
  subject_id: number;
  user_id: number;
  username: string;
}
