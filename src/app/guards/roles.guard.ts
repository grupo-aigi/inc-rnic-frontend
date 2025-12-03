import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth/auth.service';
import { Role } from '../services/intranet/user/user.interfaces';
import { LangService } from '../services/shared/lang/lang.service';

export const rolesGuard: CanMatchFn = (
  route,
): Observable<boolean> | Promise<boolean> | boolean => {
  const authService = inject(AuthService);
  const toastrService = inject(ToastrService);
  const langService = inject(LangService);

  const router = inject(Router);
  const { userInfo } = authService;
  const allowedRoles = route.data ? (route.data['roles'] as Role[]) : undefined;

  if (!allowedRoles) return true;

  const userAllowed = allowedRoles.some((role) =>
    userInfo?.roles.map(({ role }) => role).includes(role),
  );

  console.log({ userAllowed });

  if (!userAllowed) {
    toastrService.warning(langService.labels.noUserAllowed);
    router.navigate(['/intranet']);
    return false;
  }
  const isActiveRoleAllowed = allowedRoles.some(
    (role) => role === authService.activeRole!.role,
  );

  if (!isActiveRoleAllowed) {
    router.navigate(['/intranet']);
    return false;
  }

  return true;
};
