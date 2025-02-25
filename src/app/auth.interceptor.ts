import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { userStore } from './store/user.store';
import { TokenService } from './services/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const token = localStorage.getItem('token');

    const authReq = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}`, }, withCredentials: true  })
      : req;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.error('Unauthorized! Redirecting to login...');
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return throwError(() => error);
      })
    );
  }
}
