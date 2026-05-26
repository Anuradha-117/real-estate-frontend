import { Component, OnInit, signal } from '@angular/core';
import { Property } from '../../services/property'; 

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [],
  templateUrl: './properties.html',
  styleUrl: './properties.css'
})
export class Properties implements OnInit {
  propertyList = signal<any[]>([]);

  constructor(private propertyService: Property) {}

  ngOnInit(): void {
    this.propertyService.getAllProperties().subscribe({
      next: (data) => {
        this.propertyList.set(data); 
      },
      error: (err) => {
        console.error('Error fetching properties', err);
      }
    });
  }
}