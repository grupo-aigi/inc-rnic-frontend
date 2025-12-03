import { Routes } from '@angular/router';

import { intranetGuard } from './guards/intranet.guard';
import { landingGuard } from './guards/landing.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/routes').then((authRoutes) => authRoutes),
  },
  {
    path: 'intranet',
    loadChildren: () =>
      import('./modules/intranet/routes').then(
        (intranetRoutes) => intranetRoutes,
      ),
    canMatch: [intranetGuard],
  },
  {
    path: '',
    loadChildren: () =>
      import('./modules/landing/routes').then((landingRoutes) => landingRoutes),
    canMatch: [landingGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
