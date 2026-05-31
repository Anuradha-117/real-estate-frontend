import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Property } from '../../services/property';
import { UserService } from '../../services/user';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule], //uses to read from inputs
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit { 

  activeTab: string = 'addProperty';
  propertyObj: any = {
    title: '',
    location: '',
    price: null,
    propertyType: '',
    status: 'Available'
  };

  userList: any[] = [];
  staffObj: any = {
    name: '',
    email: '',
    password: '',
    role: 'Agent' 
  };

  constructor(
    private propertyService: Property, 
    private userService: UserService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  saveProperty() {
    console.log("Sending this to the database:", this.propertyObj); 

    this.propertyService.addProperty(this.propertyObj).subscribe({
      next: (res) => {
        alert('Property Saved Successfully!');
        this.router.navigate(['/properties']);
      },
      error: (err) => {
        alert('Error saving property. Check the console.');
        console.error(err);
      }
    });
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.userList = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error loading users", err);
      }
    });
  }

  registerStaff() {
    this.userService.register(this.staffObj).subscribe({
      next: (res) => {
        alert(`${this.staffObj.role} Registered Successfully!`);
        this.staffObj = { name: '', email: '', password: '', role: 'Agent' };
        this.loadUsers(); 
      },
      error: (err) => {
        alert('Registration Failed. Check if the email is already used.');
        console.error(err);
      }
    });
  }
}