import { Routes } from '@angular/router';
import { Home} from './pages/home/home'; 
import { Properties} from './pages/properties/properties';
import { Login } from './pages/login/login';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'properties', component: Properties },
  { path: 'login', component: Login},
  { path: 'admin', component: AdminDashboard }
];