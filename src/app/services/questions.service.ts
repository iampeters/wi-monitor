import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  url = '/wi-monitor/src/app/api/questions.php';

  constructor( private http: HttpClient ) { }

  getQuestions(subject) {
  return this.http.post<MySub>(this.url, {
    subject
  });
  }
}

export interface MySub {
  subject: string;
  message: string;
  success: boolean;
}
