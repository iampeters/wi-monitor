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
  chats;
  empty;
  needed = false;
  choices;
  q_count;
  gameOver;
  p_count;
  o_count;

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
       this.activity = data;
       console.log(data);

     });

     // Getting need
     this.socket.needed().subscribe( data => {
        // if (data.success === true) {
        //   this.needed = true;
        //   const chat = document.getElementById('chat');
        //   chat.style.display = 'block';
        // } else {
        //   this.needed = false;
        //   const chat = document.getElementById('chat');
        //   chat.style.display = 'none';
        // }
        console.log(data);
     });


     // Getting the chats
     this.socket.parentChatter().subscribe( data => {
       this.chats = data;
     });

     // Getting the points
     this.socket.vGameOver().subscribe( data => {
       this.gameOver = data;

     });

   }, 1000);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    setInterval(() => {
      this.socket.vQues().subscribe( data => {
        this.Ques = data;
      });

      // getting answers
      this.socket.getViewersAnswers().subscribe(data3 => {
        this.choices = data3;
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
