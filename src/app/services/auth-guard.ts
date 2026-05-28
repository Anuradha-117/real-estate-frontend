import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userStr = localStorage.getItem('loggedUser');

  // 1. Check if anyone is logged in
  if (userStr) {
    const user = JSON.parse(userStr);
    
    // 2. Are they an Admin?
    if (user.role && user.role.toLowerCase() === 'admin') {
      return true; // The door opens!
    }
  }

  // 3. KICK THEM OUT!
  alert('Access Denied! You must be an Administrator to view this page.');
  router.navigate(['/login']);
  return false;
};