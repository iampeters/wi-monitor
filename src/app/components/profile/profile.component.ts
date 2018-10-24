import { Component, OnInit } from '@angular/core';
import { MiscService } from '../../services/misc.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  leaderboard = [];

  constructor(
    private misc: MiscService,
    private router: Router
  ) { }

  ngOnInit() {
    this.misc.isLoggedIn().subscribe( data => {
      if (data.success !== true) {
        this.misc.setLoggedin(false);
        this.router.navigate(['/login']);
      } {
        this.misc.setLoggedin(true);
      }
    });

    this.misc.leaderboard().subscribe(data => {
      this.leaderboard = data;
      // console.log(data);
    });
  }

  logout() {
    this.misc.logoutUser().subscribe(data => {
      if (data.success === true) {
        this.router.navigate(['/login']);
      }
    });
  }

  breadcomb() {
    const sideNav = document.getElementById('side_nav');
    const mask = document.getElementById('mask');
    const bars = document.getElementById('breadcumb');

    sideNav.style.transition = '.3s ease-in-out';
    sideNav.style.transform = 'translateX(0)';
    sideNav.style.zIndex = '4000';
    mask.style.zIndex = '2000';
    bars.style.opacity = '0';

    mask.style.width = '100%';
    mask.style.display = 'block';
    mask.style.transition = '.3s ease-in-out';
    mask.style.position = 'absolute';
    mask.style.top = '0';
    mask.style.bottom = '0';
    mask.style.background = 'rgba(0,0,0, .8)';
  }

  close() {
    const sideNav = document.getElementById('side_nav');
    const mask = document.getElementById('mask');
    const bars = document.getElementById('breadcumb');

    mask.style.width = '0';
    mask.style.transition = '.5s ease-in-out';
    mask.style.display = 'none';
    sideNav.style.transition = '.3s ease-in-out';
    sideNav.style.transform = 'translateX(-250px)';
    bars.style.opacity = '1';
  }
}
