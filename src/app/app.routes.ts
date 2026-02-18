import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'jobs', pathMatch: 'full' },
  {
    path: 'auth',
    children: [
      {
        path: 'register',
        loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'jobs' }
];
