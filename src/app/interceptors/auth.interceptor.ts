import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);
  
  const token = cookieService.get('authToken');

  const modifiedReq = token ? req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    }
  }) : req;

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 403) {
        // Token expirado o no válido
        cookieService.delete('authToken');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};