import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MiscService } from '../../services/misc.service';
import { Game } from '../../classes/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gid',
  templateUrl: './gid.component.html',
  styleUrls: ['./gid.component.scss']
})
export class GidComponent implements OnInit {

  public games: any = [];
  error;

  gameModel = new Game('Select game ID...');

  constructor(
    private misc: MiscService,
    private http: Router
  ) { }

  ngOnInit() {
    // Getting the games
    this.misc.getGame().subscribe( data => {

      this.games = data;

    });

    // Checks if the parent isLoggedIn
    this.misc.isParentLoggedIn().subscribe(data => {
      if (data.success === false) {
        this.http.navigate(['/viewerlogin']);
      }
    });

  }

  // Getting the user's choice of game to view
  login(e) {
    const game = e.game;

    if (game === 'Select game ID...') {
      // Return error msg
      this.error = 'Please select a game to view';

    } else {

      // Getting the activities
      this.misc.viewerGame(game).subscribe( data => {
       if (data.success === true) {
         this.http.navigate(['/viewers']);

       } else if (data.success === false && data.message === 'Viewer already added') {
         this.http.navigate(['/viewers']);

        } else {
          this.error = data.message;
        }
      });

    }


  }

}
