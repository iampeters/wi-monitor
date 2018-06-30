import { Component, OnInit } from '@angular/core';
import { MiscService } from '../services/misc.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private misc: MiscService,
    private router: Router
  ) { }

  ngOnInit() {
  }


  logoutUser() {
    this.misc.logoutUser().subscribe(data => {
      if (data.success === true) {
        this.router.navigate(['/login']);
      }
    });
  }

}
