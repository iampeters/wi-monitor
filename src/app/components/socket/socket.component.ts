import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-socket',
  templateUrl: './socket.component.html',
  styleUrls: ['./socket.component.scss'],
  providers: [SocketService]
})
export class SocketComponent implements OnInit, OnDestroy {

connection;
res;

  constructor( private socket: SocketService ) { }

  ngOnInit() {
    setInterval(() => {
      const msg = 'hello dave';
      this.connection = this.socket.send(msg).subscribe(data => {
        this.res = data;
        console.log(data.message);
      });
    }, 1000);
  }

  send() {
    const msg = 'hello dave';

    this.connection = this.socket.send(msg).subscribe(data => {
      this.res = data.message;
      console.log(data);
    });
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

}
