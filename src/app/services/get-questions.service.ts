import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetQuestionsService {

  url = '/wi-monitor/src/app/api/get/subjectChoice.php';
  url1 = '/wi-monitor/src/app/api/get/getQuestions.php';
  url2 = '/wi-monitor/src/app/api/get/generator.php';

  constructor( private http: HttpClient ) { }

  // Getting the user preferred subject
  getSubject() {
    return this.http.get<MyInt>(this.url);
  }

  // Getting questions from the preferred subject
  getQuestions() {
    return this.http.get<MyInt>(this.url1);
  }

  // Getting questions from the server
  generator() {
    return this.http.get<MyInt>(this.url2);
  }
}
export interface MyInt {
  Subject: string;
  question: string;
  Qid: number;
  option1: string;
  option2: string;
  option3: string;
  answer: string;
  success: boolean;
  message: string;
}
