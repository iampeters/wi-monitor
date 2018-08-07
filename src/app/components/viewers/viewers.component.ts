import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MiscService } from '../../services/misc.service';
import { Router } from '@angular/router';
import { GetQuestionsService } from '../../services/get-questions.service';
import { Chat } from '../../classes/user';

@Component({
  selector: 'app-viewers',
  templateUrl: './viewers.component.html',
  styleUrls: ['./viewers.component.scss']
})
export class ViewersComponent implements OnInit {
  public activity = [];
  error;
  public Ques = [];
  chats = [];
  empty;
  needed = false;
  choices = [];
  q_count;
  gameOver = [];
  p_count;
  o_count;

  chatModel = new Chat('', '');

  constructor(
    private misc: MiscService,
    private http: Router,
    public vQues: GetQuestionsService
  ) { }

  ngOnInit() {

    // Getting game activity
   setInterval(() => {
     this.misc.viewerInit().subscribe(data => {
       this.activity = data;
      //  console.log(data);

     });

     // Getting need
     this.misc.needed().subscribe( data => {
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
     this.misc.parentChatter().subscribe( data => {
       this.chats = data;
     });

     // Getting the points
     this.misc.vGameOver().subscribe( data => {
       this.gameOver = data;

     });

   }, 1000);

    // Checks if the parent isLoggedIn
    this.misc.isParentLoggedIn().subscribe(data => {
      if (data.success === false) {
        this.http.navigate(['viewerlogin']);
      }
    });
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    setInterval(() => {
      this.vQues.vQues().subscribe( data => {
        this.Ques = data;
      });

      // getting answers
      this.misc.getViewersAnswers().subscribe(data3 => {
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
        this.http.navigate(['viewerlogin']);
      }
    });
  }

}
