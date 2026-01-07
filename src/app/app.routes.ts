import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'establishment-signup',
    loadComponent: () => import('./features/establishment-signup/establishment-signup.component').then(m => m.EstablishmentSignupComponent)
  },
  {
    path: 'receipt-upload',
    loadComponent: () => import('./features/receipt-upload/receipt-upload.component').then(m => m.ReceiptUploadComponent)
  }
];
