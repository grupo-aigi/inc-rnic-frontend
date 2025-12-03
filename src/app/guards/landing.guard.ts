import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const landingGuard: CanMatchFn = (
  route,
  segments,
): Observable<boolean> | Promise<boolean> | boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const authenticated = authService.validateAuth();
  if (authenticated) {
    router.navigate(['/intranet']);
    return false;
  }
  return true;
};
