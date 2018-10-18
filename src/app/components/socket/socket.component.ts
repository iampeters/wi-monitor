import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-socket',
  templateUrl: './socket.component.html',
  styleUrls: ['./socket.component.scss']
})
export class SocketComponent implements OnInit {

  constructor(
    private socket: SocketService
    ) { }

  ngOnInit() {
  }

  send() {
    const msg = 'hello';
    this.socket.message(msg).subscribe( data => {
      console.log(data);
    });
  }

}
