import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userStr = localStorage.getItem('loggedUser');

  if (userStr) {
    const user = JSON.parse(userStr);

    if (user.role) {
      const role = user.role.toLowerCase();
      if (role === 'admin' || role === 'seller' || role === 'agent') {
        return true;
      }
    }
  }

  alert('Access Denied! You must be an authorized staff to view this page.');
  router.navigate(['/login']);
  return false;
};