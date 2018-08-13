import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  setterUrl = '/wi-monitor/src/app/api/get/setter.php';
  getterUrl = '/wi-monitor/src/app/api/post/getter.php';
  timerUrl = '/wi-monitor/src/app/api/get/timer.php';
  getTimeUrl = '/wi-monitor/src/app/api/get/getTime.php';
  guardianLoginUrl = '/wi-monitor/src/app/api/post/guardianLogin.php';
  getGameUrl = '/wi-monitor/src/app/api/get/game.php';
  gameInitUrl = '/wi-monitor/src/app/api/post/gameActivity.php';
  gameInit = '/wi-monitor/src/app/api/post/game.php';
  parentChkUrl = '/wi-monitor/src/app/api/user/parentChk.php';
  getViewersUrl = '/wi-monitor/src/app/api/get/getViewers.php';
  chatUrl = '/wi-monitor/src/app/api/post/chat.php';
  parentChatUrl = '/wi-monitor/src/app/api/post/parentchat.php';
  parentChatterUrl = '/wi-monitor/src/app/api/post/parentchatter.php';
  chatterUrl = '/wi-monitor/src/app/api/get/chatter.php';
  neededUrl = '/wi-monitor/src/app/api/get/needed.php';
  vLogoutUrl = '/wi-monitor/src/app/api/user/vLogout.php';
  answers = '/wi-monitor/src/app/api/get/getAnswers.php';
  answersViewers = '/wi-monitor/src/app/api/get/viewersAnswers.php';
  chkAnswers = '/wi-monitor/src/app/api/post/chkAnswer.php';
  getP2Url = '/wi-monitor/src/app/api/get/scores.php';
  getQuesUrl = '/wi-monitor/src/app/api/post/getQuestions.php';
  scoreUpdateUrl = '/wi-monitor/src/app/api/get/scoresUpdate.php';
  gameOverUrl = '/wi-monitor/src/app/api/get/gameOver.php';
  vGameOverUrl = '/wi-monitor/src/app/api/post/vGameOver.php';
  quesDecUrl = '/wi-monitor/src/app/api/post/quesDec.php';
  liveUrl = 'wi-monitor/src/app/api/sample.php';
  liveAnswerUrl = 'wi-monitor/src/app/api/getAnswers.php';

  private loggedInStatus = false;


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
    return this.http.get<Myface>(this.isLoggedInUrl);
  }

  // Checks if a parent is logged in
  isParentLoggedIn() {
    return this.http.get<Myface>(this.parentChkUrl);
  }


  setLoggedin(value: boolean) {
    this.loggedInStatus = value;
  }

  get loginChk() {
    return this.loggedInStatus;
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

  // This method will get and set the player turn in the database
  setter() {
    return this.http.get<Tagger>(this.setterUrl);
  }

  // This will check whose turn it is to play
  getter() {
    return this.http.get<Tagger>(this.getterUrl);
  }

  // This will set the timer
  timer() {
    return this.http.get<Tagger>(this.timerUrl);
  }

  // This will get the time set above
  getTime() {
    return this.http.get<Tagger>(this.getTimeUrl);
  }

  // This will add Guardian/Parents
  addGuardian(guardian, ward, relationship, phone, email, username) {
    return this.http.post<Tagger>(this.addGuardianUrl, {
      guardian,
      ward,
      relationship,
      phone,
      email,
      username
    });
  }

  // Guardian login
  guardianLogin(username, ward) {
    return this.http.post<Tagger>(this.guardianLoginUrl, {
      username, ward
    });
  }

  // Getting game sessions
  getGame() {
    return this.http.get<Game[]>(this.getGameUrl);
  }

  // Viewers Activity
  viewerInit() {
    return this.http.get<Activity[]>(this.gameInitUrl);
  }

  // Viewers game activity
  viewerGame(game) {
    return this.http.post<Tagger>(this.gameInit, {
      game
    });
  }

  // Get viewers
  getViewers() {
    return this.http.get<Game>(this.getViewersUrl);
  }

  // Chat
  chat(message) {
    return this.http.post<Myface>(this.chatUrl, {
      message
    });
  }

  parentChat(message) {
    return this.http.post<Myface>(this.parentChatUrl, {
      message
    });
  }

  // Chatter
  chatter() {
    return this.http.get<Chatter[]>(this.chatterUrl);
  }

  // Parent Chatter
  parentChatter() {
    return this.http.get<Chatter[]>(this.parentChatterUrl);
  }

  // Needed
  needed() {
    return this.http.get<Chatter>(this.neededUrl);
  }

  // Close needed
  close(close) {
    return this.http.post<Chatter>(this.neededUrl, {
      close
    });
  }

  // Open needed
  open(open) {
    return this.http.post<Chatter>(this.neededUrl, {
      open
    });
  }

  // Logout viewer
  vLogout() {
    return this.http.get<Chatter>(this.vLogoutUrl);
  }

  // Get answers
  getAnswers() {
    return this.http.get<Myface[]>(this.answers);
  }

  // Get viewers answers
  getViewersAnswers() {
    return this.http.get<Myface[]>(this.answersViewers);
  }

  // Get questions
  getQues() {
    return this.http.get<Myface>(this.getQuesUrl);
  }

  // Get answers for viewers
  vgetAnswers() {
    return this.http.get<Myface[]>(this.answers);
  }

  // Checking for correct answer
  chkAnswer(choice) {
    return this.http.post<Tagger>(this.chkAnswers, {
      choice
    });
  }

  // Get player 2 scores
  getOpp() {
    return this.http.get<Activity[]>(this.getP2Url);
  }

  // Get player 1 scores
  getP1Scores() {
    return this.http.get<Activity[]>(this.scoreUpdateUrl);
  }

  // Game over
  gameOver() {
    return this.http.get<GameOver[]>(this.gameOverUrl);
  }

  // Parents/Viewers Game over display
  vGameOver() {
    return this.http.get<GameOver[]>(this.vGameOverUrl);
  }

  // This will decrement questions
  quesDec() {
    return this.http.get(this.quesDecUrl);
  }

  // Live viewers links
  getLiveData(id) {
    return this.http.post<Data[]>(this.liveUrl, {
      id
    });
  }

  getLiveAns() {
    return this.http.get<Data[]>(this.liveAnswerUrl);
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
  option4: string;
  answer: string;
  question: string;
  ward: string;
  question_id: number;
}

export interface Chatter {
  success: boolean;
  mid: number;
  sender: string;
  receiver: string;
  message: string;
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
  msg: boolean;
  time: number;
}

export interface Game {
  session_key: string;
  success: boolean;
  message: string;
}

export interface Activity {
  success: boolean;
  opponent: string;
  player: string;
  subject: string;
  p_correct: number;
  p_wrong: number;
  p_scores: number;
  o_correct: number;
  o_wrong: number;
  o_scores: number;
  p_username: string;
  o_username: string;
  o_fullname: string;
  p_fullname: string;
  viewers: number;
  o_count: any;
  p_count: number;
  p_turn: number;
  o_turn: number;
  p_questions: number;
  o_questions: any;
}

export interface GameOver {
  player: string;
  opponent: string;
}

export interface Data {
  o_scores: number;
  scores: number;
  o_wrong: number;
  wrong: number;
  correct: number;
  o_correct: number;
  subject: string;
  p2_name: string;
  p_name: string;
  p_question: string;
  o_question: any;
  question: string;
  p1_turn: number;
  p2_turn: number;
  viewers: number;

  // Options from the set question
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}
