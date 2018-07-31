import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetQuestionsService {

  url = '/wi-monitor/src/app/api/get/subjectChoice.php';
  url1 = '/wi-monitor/src/app/api/get/getQuestions.php';
  url2 = '/wi-monitor/src/app/api/get/generator.php';
  url3 = '/wi-monitor/src/app/api/get/vQues.php';
  chatUrl = '/wi-monitor/src/app/api/get/chat.php';

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

  // Get questions for loggedIn viewers
  vQues() {
    return this.http.get<VQues[]>(this.url3);
  }

  // Chat
  chat(q) {
    return this.http.post<MyInt>(this.chatUrl, {
      q
    });
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
export interface VQues {
  p_question: string;
  p_option_1: string;
  p_option_2: string;
  p_option_3: string;
  p_answer: string;
  o_question: string;
  o_option_1: string;
  o_option_2: string;
  o_option_3: string;
  o_answer: string;
  success: boolean;
  message: string;
}
