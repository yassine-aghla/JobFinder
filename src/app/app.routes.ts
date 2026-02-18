import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import {LoginComponent} from './login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'jobs', pathMatch: 'full' },
  {
    path: 'auth',
    children: [
      {
        path: 'register',
        loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'jobs' }
];
