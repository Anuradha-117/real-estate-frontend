import { Component, OnInit, signal, computed } from '@angular/core';
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
  currentFilter = signal<string>('Available');
  filteredProperties = computed(() => {
    const list = this.propertyList();
    const filter = this.currentFilter();

    if (filter === 'All') return list;
    return list.filter(p => p.status === filter);
  });

  constructor(private propertyService: Property) { }

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

  setFilter(status: string) {
    this.currentFilter.set(status);
  }

}