import { Component } from '@angular/core';
import { MiscService } from './services/misc.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'app';

  constructor (
    private misc: MiscService
  ) {}

  // ngOnInit() {
  // 	this.misc.isLoggedIn().subscribe(data => {
  // 		if(data.success === true) {
  // 			this.misc.loginChk
  // 		}
  // 	})
  // }
}
