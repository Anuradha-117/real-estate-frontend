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
  selectedFile: File | null = null;
  reportData = {
    totalProperties: 0,
    availableProperties: 0,
    soldProperties: 0,
    rentedProperties: 0,
    totalUsers: 0,
    totalAgents: 0,
    totalSellers: 0,
    totalCustomers: 0,
    totalInquiries: 0,
    pendingInquiries: 0,
    resolvedInquiries: 0
  };

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

    setTimeout(() => {
      this.generateMISReport();
    }, 500);

  }

  saveProperty() {

    if (!this.propertyObj.title || !this.propertyObj.location || !this.propertyObj.price || !this.propertyObj.propertyType) {
      alert('Please fill in all required fields (Title, Location, Price, and Type) before saving.');
      return;
    }
    const userStr = localStorage.getItem('loggedUser');

    if (userStr) {
      this.propertyObj.sellerEmail = JSON.parse(userStr).email;
    }

    const formData = new FormData();
    formData.append('property', JSON.stringify(this.propertyObj));

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.propertyService.addProperty(formData).subscribe({
      next: (res) => {
        alert('Property Saved Successfully!');
        this.propertyObj = { title: '', location: '', price: null, propertyType: '', status: 'Available' };
        this.selectedFile = null;
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
        this.userList = res.filter((user: any) => user.role !== 'Admin');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error loading users", err);
      }
    });
  }

  deleteUser(id: number) {
    const isSure = confirm("Are you sure you want to completely remove this user from the system?");
    if (isSure) {
      this.userService.deleteUser(id).subscribe({
        next: (res) => {
          alert('User deleted successfully!');
          this.loadUsers();
        },
        error: (err) => {
          console.error("Error deleting user", err);
          alert('Failed to delete user.');
        }
      });
    }
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

  resolveInquiry(id: number) {
    const isSure = confirm("Are you sure you want to mark this inquiry as resolved?");
    if (isSure) {
      this.inquiryService.resolveInquiry(id).subscribe({
        next: (res) => {
          alert('Inquiry marked as resolved!');
          this.loadInquiries();
        },
        error: (err) => {
          console.error("Error resolving inquiry", err);
          alert('Failed to resolve inquiry.');
        }
      });
    }
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  generateMISReport() {
    // Cout Properties
    this.reportData.totalProperties = this.propertyList.length;
    this.reportData.availableProperties = this.propertyList.filter(p => p.status === 'Available').length;
    this.reportData.soldProperties = this.propertyList.filter(p => p.status === 'Sold').length;
    this.reportData.rentedProperties = this.propertyList.filter(p => p.status === 'Rented').length;

    // Count Users
    this.reportData.totalUsers = this.userList.length;
    this.reportData.totalAgents = this.userList.filter(u => u.role === 'Agent').length;
    this.reportData.totalSellers = this.userList.filter(u => u.role === 'Seller').length;
    this.reportData.totalCustomers = this.userList.filter(u => u.role === 'Customer').length;

    // Count Inquiris
    this.reportData.totalInquiries = this.inquiryList.length;
    this.reportData.pendingInquiries = this.inquiryList.filter(i => i.status === 'Pending').length;
    this.reportData.resolvedInquiries = this.inquiryList.filter(i => i.status === 'Resolved').length;
  }
}