import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

    const securedEndpoints = ['/api/Private', '/api/Auth/ChangePassword'];

    if (securedEndpoints.some(url => req.url.includes(url)) && token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

  return next(req);
};

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        console.error('Nieautoryzowany dostęp - status 401');
        authService.clearToken()
      }
      return throwError(() => error);
    })
  );
};
