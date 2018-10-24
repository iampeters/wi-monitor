import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MiscService } from '../services/misc.service';
import { GetQuestionsService } from '../services/get-questions.service';
import { SocketService } from '../../socket.service';

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

  constructor(
    private misc: MiscService,
    private actived: ActivatedRoute,
    private http: Router,
    public vQues: GetQuestionsService,
    private socket: SocketService
  ) { }

  ngOnInit() {
    this.actived.paramMap.subscribe( params => {
      this.id = params.get('id');
    });

    // Getting game activity
    setInterval(() => {
      this.socket.getLiveData(this.id).subscribe(data => {
        this.activity = data;
    });

    // Getting the points
    this.socket.vGameOver().subscribe(data => {
      this.gameOver = data;
    });

    // Get Answers
    this.socket.getLiveAns().subscribe( data => {
      this.choices = data;
    });

    }, 1000);

  }


  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    // setInterval(() => {
    //   this.vQues.vQues().subscribe(data => {
    //     this.Ques = data;
    //   });

      // getting answers
    //   this.misc.getViewersAnswers().subscribe(data3 => {
    //     this.choices = data3;
    //   });
    // }, 1000);
  }

}
