import { Component, OnInit } from '@angular/core';
import { MiscService } from '../../services/misc.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {

  leaderboard: any = [];

  constructor( private misc: MiscService) { }

  ngOnInit() {
    this.misc.leaderboard().subscribe( data => {
      this.leaderboard = data;
    });
  }

  logout() {
    window.close();
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
