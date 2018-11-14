import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MiscService } from '../services/misc.service';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss'],
  providers: [SocketService]
})
export class LiveComponent implements OnInit {

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
  public id: any;
  nogame: boolean;
  message;

  constructor(
    private misc: MiscService,
    private actived: ActivatedRoute,
    private http: Router,
    private socket: SocketService
  ) { }

  ngOnInit() {
    this.actived.paramMap.subscribe( params => {
      this.id = params.get('id');
    });

    // Getting game activity
    setInterval(() => {
      this.socket.getLiveData(this.id).subscribe(data => {
        if (data.success === false) {
          this.nogame = true;

          this.message = data.message;
          // console.log(data.message);
        } else {
          this.activity = data;
        }
    });

    // Getting the points
    this.socket.vGameOver().subscribe(data => {
      // this.gameOver = data;
      // console.log(data);
    });

    // Get Answers
    this.socket.getLiveAns().subscribe( data => {
      this.choices = data;
    });

    }, 1000);

  }

}
