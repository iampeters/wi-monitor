import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService  implements HttpInterceptor {

  constructor() { }

  intercept ( req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
    const token = req.clone({
      withCredentials: true,
    });
    return next.handle(token);
  }
}
