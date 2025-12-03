import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const intranetGuard: CanMatchFn = (
  route,
  segments,
): Observable<boolean> | Promise<boolean> | boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const authenticated = authService.validateAuth();
  if (!authenticated) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
