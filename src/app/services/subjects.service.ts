import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SubjectsService {

  constructor( private http: HttpClient ) { }

  // Getting subjects
  getSubjects() {
    return this.http.get<Data[]>('/wi-monitor/src/app/api/subjects.php');
  }

  // Getting wards
  getWards() {
    return this.http.get<Data[]>('/wi-monitor/src/app/api/get/wards.php');
  }

}

export interface Data {
  subject: string;
  subject_id: number;
  user_id: number;
  username: string;
}
