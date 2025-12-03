import { Routes } from '@angular/router';

import { AuthLayout } from './auth-layout.component';
import { PreregisterAgreementsPage } from './pages/pre-register-agreements/preregister-agreements-page.component';
import { RegisterPage } from './pages/register/register-page.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: '',
        redirectTo: 'lineamientos-red',
        pathMatch: 'full',
      },
      {
        path: 'lineamientos-red',
        component: PreregisterAgreementsPage,
      },
      {
        path: 'register',
        component: RegisterPage,
      },
      {
        path: '**',
        redirectTo: '/',
      },
    ],
  },
];

export default routes;
