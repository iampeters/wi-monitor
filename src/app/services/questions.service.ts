import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  url = 'http://localhost:3000/';

  constructor( private http: HttpClient ) { }

  getQuestions(subject) {
  return this.http.post<MySub>(this.url + 'questions', {
    subject
  });

  }
}

export interface MySub {
  subject: string;
  message: string;
  success: boolean;
}
