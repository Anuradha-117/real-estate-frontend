import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  // Objectfor login
  loginObj: any = {
    email: '',
    password: ''
  };

  // Object for register
  registerObj: any = {
    name: '',
    email: '',
    password: ''
  };

  constructor(private userService: UserService, private router: Router) { }

  onRegister() {
    this.userService.register(this.registerObj).subscribe({
      next: (res) => {
        alert('Registration Successful! You can now log in.');
        this.registerObj = { name: '', email: '', password: '' };
      },
      error: (err) => {
        alert('Registration Failed. This email may already be in use. Please try again.');
        console.error('System Error:', err); //to see by devs
      }
    });
  }

  onLogin() {
    this.userService.login(this.loginObj).subscribe({
      next: (res) => {
        if (res) {
          alert(`Welcome back, ${res.name}!`);
          localStorage.setItem('loggedUser', JSON.stringify(res));
          const userRole = res.role.toLowerCase();

          if (userRole === 'admin') {
            this.router.navigate(['/admin-dashboard']);
          } else if (userRole === 'agent') {
            //need to do
            this.router.navigate(['/']);
          } else if (userRole === 'seller') {
            // need to to
            this.router.navigate(['/']);
          } else {
            this.router.navigate(['/properties']);
          }

        } else {
          alert('Invalid Email or Password. Please try again.');
        }
      },
      error: (err) => {
        alert('We are having trouble connecting to the server. Please try again later.');
        console.error('System Error:', err);
      }
    });
  }
}