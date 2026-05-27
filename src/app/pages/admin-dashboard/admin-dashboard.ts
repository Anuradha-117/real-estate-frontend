import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Property } from '../../services/property';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule], //uses to read from inputs
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard {
  propertyObj: any = {
    title: '',
    location: '',
    price: null,
    propertyType: '',
    status: 'Available'
  };

  constructor(private propertyService: Property, private router: Router) {}

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
}