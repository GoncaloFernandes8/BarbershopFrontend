import { Routes } from '@angular/router';
import { approvedGuard } from './guards/approved.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/auth/auth.component').then(m => m.AuthComponent), title: 'Login · Barbearia' },
  { path: 'registar', loadComponent: () => import('./pages/auth/auth.component').then(m => m.AuthComponent), title: 'Criar conta · Barbearia' },
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent), title: 'Barbearia' },
  { path: 'sucesso/:id', loadComponent: () => import('./pages/success/success.component').then(m => m.SuccessComponent), title: 'Confirmado · Barbearia' },
  { path: 'servicos', loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent), title: 'Serviços · Barbearia' },
  { path: 'marcacao', loadComponent: () => import('./pages/booking/booking.component').then(m => m.BookingComponent), canActivate: [approvedGuard], title: 'Marcação · Barbearia' },
  { path: 'historico', loadComponent: () => import('./pages/history/history.component').then(m => m.HistoryComponent), canActivate: [approvedGuard], title: 'Histórico · Barbearia' },
  { path: 'confirmar', loadComponent: () => import('./pages/confirm/confirm.component').then(m => m.ConfirmComponent), title: 'Confirmar email' },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent), title: 'Não encontrado' },

];
