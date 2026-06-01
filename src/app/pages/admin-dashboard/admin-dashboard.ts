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
  imports: [FormsModule, CommonModule], //uses to read from inputs
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
  propertyList: any[] = [];
  showEditModal: boolean = false;
  editPropertyObj: any = {};

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
      } else if (this.userRole === 'Seller' || this.userRole === 'Admin') {
        this.loadProperties(); // Load properties for the table!
      }
    }
    this.loadUsers();
    this.loadInquiries();
  }

  saveProperty() {
    const userStr = localStorage.getItem('loggedUser');

    if (userStr) {
      const user = JSON.parse(userStr);
      this.propertyObj.sellerEmail = user.email;
    }
    this.propertyService.addProperty(this.propertyObj).subscribe({
      next: (res) => {
        alert('Property Saved Successfully!');
        this.propertyObj = { title: '', location: '', price: null, propertyType: '', status: 'Available' };
        this.loadProperties();
        this.activeTab = 'manageProperties';
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

  loadProperties() {
    this.propertyService.getAllProperties().subscribe({
      next: (res) => {
        if (this.userRole === 'Seller') {
          const userStr = localStorage.getItem('loggedUser');
          if (userStr) {
            const user = JSON.parse(userStr);
            this.propertyList = res.filter((p: any) => p.sellerEmail === user.email);
          }
        } else {
          this.propertyList = res;
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error loading properties", err)
    });
  }

  deleteProperty(id: number) {
    const isSure = confirm("Are you sure you want to completely delete this property?");
    if (isSure) {
      this.propertyService.deleteProperty(id).subscribe({
        next: (res) => {
          alert('Property deleted successfully!');
          this.loadProperties();
        },
        error: (err) => {
          console.error("Error deleting property", err);
          alert('Failed to delete property.');
        }
      });
    }
  }

  openEditModal(property: any) {
    //used the spread oprator to create a copy so we dont accidentally edit the live table data b4 saving
    this.editPropertyObj = { ...property };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  updateProperty() {
    this.propertyService.updateProperty(this.editPropertyObj.id, this.editPropertyObj).subscribe({
      next: (res) => {
        alert('Property updated successfully!');
        this.closeEditModal();
        this.loadProperties();
      },
      error: (err) => {
        console.error("Error updating property", err);
        alert('Failed to update property.');
      }
    });
  }
}