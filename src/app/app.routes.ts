import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Properties } from './pages/properties/properties';
import { Login } from './pages/login/login';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { authGuard } from './services/auth-guard'

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'properties', component: Properties },
  { path: 'login', component: Login },
  { path: 'admin-dashboard', component: AdminDashboard, canActivate: [authGuard] }
];