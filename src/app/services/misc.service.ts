import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MyInt } from './get-questions.service';

@Injectable({
  providedIn: 'root'
})
export class MiscService {

  url = '/wi-monitor/src/app/api/get/sessionUnset.php';
  regUrl = '/wi-monitor/src/app/api/user/register.php';
  loginUrl = '/wi-monitor/src/app/api/user/login.php';
  logoutUrl = '/wi-monitor/src/app/api/user/logout.php';
  useChkUrl = '/wi-monitor/src/app/api/user/userCheck.php';
  addQuestionUrl = '/wi-monitor/src/app/api/post/addQuestion.php';
  addSubjectUrl = '/wi-monitor/src/app/api/post/addSubject.php';
  addGuardianUrl = '/wi-monitor/src/app/api/post/addGuardian.php';
  taggerUrl = '/wi-monitor/src/app/api/get/tagger.php';
  isLoggedInUrl = '/wi-monitor/src/app/api/user/isLoggedIn.php';
  scoresUrl = '/wi-monitor/src/app/api/post/scoresUpdate.php';

  constructor( private http: HttpClient ) { }

  // unset subject session variable
  sessionUnset() {
    return this.http.get<Myface>(this.url);
  }

  // Register a new user
  registerUser(fname, username, password) {
    return this.http.post<Myface>(this.regUrl, {
      fname,
      username,
      password
    });
  }

  // Login user
  loginUser(username, password) {
    return this.http.post<Myface>(this.loginUrl, {
      username,
      password
    });
  }

  // Logout user
  logoutUser() {
    return this.http.get<Myface>(this.logoutUrl);
  }

  // Check which user isLoggedIn
  userCheck() {
    return this.http.get<Myface>(this.useChkUrl);
  }

  // Add subject
  addSubject(subject) {
    return this.http.post<Myface>(this.addSubjectUrl, {
      subject
    });
  }

  // Add question
  addQuestion(question, subject, option1, option2, option3, answer) {
    return this.http.post<Myface>(this.addQuestionUrl, {
      question, subject, option1, option2, option3, answer
    });
  }

  // This will tag the players
  tagger() {
    return this.http.get<Tagger>(this.taggerUrl);
  }

  // This will check if a user is logged in for all template
  isLoggedIn() {
    return this.http.get<Tagger>(this.isLoggedInUrl);
  }

  // This will update the scores table when the user answer is wrong
  ansWrong(wrong) {
    return this.http.post<Tagger>(this.scoresUrl, {
      wrong
    });
  }

  // This will update the scores table when the user answer is correct
  ansCorrect(right) {
    return this.http.post<Tagger>(this.scoresUrl, {
      right
    });
  }

  // Checking if the admin is logged in
  isLoggedInUser() {
    return this.http.get(this.isLoggedInUrl);
  }

}
export interface Myface {
  success: boolean;
  fullname: string;
  username: string;
  password: string;
  message: string;
  guardian: string;
  subject: string;
  option1: string;
  option2: string;
  option3: string;
  answer: string;
  question: string;
  ward: string;
}

export interface Tagger {
  success: boolean;
  message: string;
  data: string;
  game_id: number;
  tag_id: number;
  subject_id: number;
  subject: string;
  player_id: number;
  opponent_id: number;
  session_key: string;
  player_name: string;
  opponent_name: string;
  loggedInUser: string;
  username: string;
  wrong: number;
  right: number;
  value: number;
  scores: number;
}
