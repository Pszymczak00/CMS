import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const adminToken = authService.getToken();
  const clientToken = authService.getClientToken();

  const adminEndpoints = ['/api/Private', '/api/Auth/ChangePassword'];
  const clientEndpoints = ['/api/Clients/me', '/api/Clients/orders', '/api/Clients/orders/rate', '/api/Clients/orders/days', '/api/Public/CreateOrder'];

  if (adminEndpoints.some(url => req.url.includes(url)) && adminToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${adminToken}`
      }
    });
  } else if (clientEndpoints.some(url => req.url.includes(url)) && clientToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${clientToken}`
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
        // Clear appropriate token based on endpoint
        if (req.url.includes('/api/Private') || req.url.includes('/api/Auth')) {
          authService.clearToken();
        } else if (req.url.includes('/api/Clients')) {
          authService.clearClientToken();
        }
      }
      return throwError(() => error);
    })
  );
};
