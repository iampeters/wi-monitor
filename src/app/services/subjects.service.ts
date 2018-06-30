import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SubjectsService {

  constructor( private http: HttpClient ) { }

  getSubjects() {
    return this.http.get<Data[]>('/wi-monitor/src/app/api/subjects.php');
  }

}

export interface Data {
  subject: string;
  subject_id: number;
}
