import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MiscService } from '../../services/misc.service';
import { Router } from '@angular/router';
import { GetQuestionsService } from '../../services/get-questions.service';
import { Chat } from '../../classes/user';
import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-viewers',
  templateUrl: './viewers.component.html',
  styleUrls: ['./viewers.component.scss'],
  providers: [SocketService]
})
export class ViewersComponent implements OnInit {
  public activity;
  error;
  public Ques;
  chats: any = [];
  empty;
  needed = false;
  choices = [];
  q_count;
  gameOver;

  player;
  opponent;
  p_scores;
  p_correct;
  p_wrong;
  o_scores;
  o_correct;
  o_wrong;
  p_username;
  o_username;
  subject;
  p_fullname;
  o_fullname;
  viewers;
  o_count;
  p_count;
  p_turns;
  o_turns;
  p_ques;
  o_ques;

  time = 0;

  chatModel = new Chat('', '');

  constructor(
    private misc: MiscService,
    private http: Router,
    public vQues: GetQuestionsService,
    private socket: SocketService
  ) { }

  ngOnInit() {
    // Checks if the parent isLoggedIn
    this.misc.isParentLoggedIn().subscribe(data => {
      if (data.success === false) {
        this.http.navigate(['/viewerlogin']);
      }
    });

    // Getting game activity
    setInterval(() => {
     this.socket.viewerInit().subscribe(data => {

      this.player = data.player;
      this.opponent = data.opponent;
      this.p_scores = data.scores;
      this.p_correct = data.correct;
      this.p_wrong = data.wrong;
      this.o_scores = data.o_scores;
      this. o_correct = data.o_correct;
      this.o_wrong = data.o_wrong;
      this.subject = data.subject;
      this.p_fullname = data.p_fullname;
      this.o_fullname = data.o_fullname;
      this.viewers = data.viewers;
      this.p_turns = data.p_turns;
      this.o_turns = data.o_turns;
      this.p_ques = data.p_ques;
      this.o_ques = data.o_ques;
      this.p_username = data.p_username;

     });

     // Getting need
     this.socket.needed().subscribe( data => {
        if (data.success === true) {
          this.needed = true;
          const chat = document.getElementById('chat');
          chat.style.display = 'block';
        } else {
          this.needed = false;
          const chat = document.getElementById('chat');
          chat.style.display = 'none';
        }
     });


     // Getting the chats
     this.socket.parentChatter().subscribe( data => {
       this.chats = data;
     });

     // Getting the points
     this.socket.vGameOver().subscribe( data => {
       this.gameOver = data;
      //  console.log(data);
      this.player = data.player;
      this.opponent = data.opponent;

     });

   }, 1000);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    setInterval(() => {
      this.socket.vQues().subscribe( data => {
        this.Ques = data.question;
        // console.log(data);
      });

      // getting answers
      this.socket.getViewersAnswers().subscribe(res => {
        this.choices = res;
        // console.log(res);
      });
    }, 1000);
  }

  // LifeLIne
  life() {
    const chat = document.getElementById('chat');
    chat.style.display = 'block';
  }

  // Close chat
  close() {
    const chat = document.getElementById('chat');
    chat.style.display = 'none';
  }

  // chat
  chat(e) {
    const txt = e.txt;
    if (txt === '') {
      this.empty = 'Please ask a question';

    } else {

      this.misc.parentChat(txt).subscribe();
    }
  }

  // Logout
  logout() {
    this.misc.vLogout().subscribe( data => {
      if (data.success === true) {
        this.http.navigate(['/viewerlogin']);
      }
    });
  }

}
