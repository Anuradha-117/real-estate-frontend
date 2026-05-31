import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Property } from '../../services/property';
import { UserService } from '../../services/user';
import { Router } from '@angular/router';
import { InquiryService } from '../../services/inquiry';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule,CommonModule], //uses to read from inputs
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  activeTab: string = 'addProperty';
  userRole: string = '';

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

  inquiryList: any[] = [];

  constructor(
    private propertyService: Property,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private inquiryService: InquiryService
  ) { }

  ngOnInit() {
    const userStr = localStorage.getItem('loggedUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.userRole = user.role;

      if (this.userRole === 'Agent') {
        this.activeTab = 'inquiries';
      }
    }
    this.loadUsers();
    this.loadInquiries();
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

  loadInquiries() {
    this.inquiryService.getAllInquiries().subscribe({
      next: (res) => {
        this.inquiryList = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error loading inquiries", err);
      }
    });
  }
}