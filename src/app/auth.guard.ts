import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { MiscService } from './services/misc.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

constructor (
  private misc: MiscService,
  private router: Router
) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.misc.loginChk){
    	return true;
    } else {
    	this.router.navigate(['/login']);
    	return false
    }
  }
}
