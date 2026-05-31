import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'Real Estate System';

  constructor(private router: Router) { }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('loggedUser');
  }

  get isAdmin(): boolean {
    const userStr = localStorage.getItem('loggedUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.role && user.role.toLowerCase() === 'admin';
    }
    return false;
  }

  logout() {
    const isSure = confirm("Are you sure you want to log out?");
    if (isSure) {
      localStorage.removeItem('loggedUser');
      this.router.navigate(['/login']);
    }
  }

  get userRole(): string {
    const userStr = localStorage.getItem('loggedUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.role ? user.role : '';
    }
    return '';
  }
}
