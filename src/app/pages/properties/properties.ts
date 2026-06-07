import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Property } from '../../services/property';
import { InquiryService } from '../../services/inquiry';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [FormsModule],
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

  showModal = false;
  inquiryObj: any = {
    propertyId: null,
    message: '',
    contactNumber: ''
  };
  showImageModal: boolean = false;
  selectedImageUrl: string = '';

  constructor(
    private propertyService: Property,
    private inquiryService: InquiryService
  ) { }

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

  canInquire(): boolean {
    const userStr = localStorage.getItem('loggedUser');
    if (!userStr) {
      return true; //make sure contact btn is not showng or guests
    }
    const user = JSON.parse(userStr);
    return user.role === 'Customer'; // Only show to Customers
  }

  openInquiry(propertyId: number) {
    // login chck
    const userStr = localStorage.getItem('loggedUser');
    if (!userStr) {
      alert('Please log in to contact an agent.');
      return;
    }

    // form
    this.inquiryObj.propertyId = propertyId;
    this.inquiryObj.message = '';
    this.inquiryObj.contactNumber = '';
    this.showModal = true;
  }

  closeInquiry() {
    this.showModal = false;
  }

  submitInquiry() {
    const userStr = localStorage.getItem('loggedUser');
    if (userStr) {
      const user = JSON.parse(userStr);

      const finalInquiry = {
        ...this.inquiryObj,
        customerEmail: user.email
      };

      this.inquiryService.submitInquiry(finalInquiry).subscribe({
        next: (res) => {
          alert('Inquiry sent successfully! An agent will contact you soon.');
          this.closeInquiry();
        },
        error: (err) => {
          console.error('Error sending inquiry', err);
          alert('Failed to send inquiry. Please try again.');
        }
      });
    }
  }

  openImageModal(imageUrl: string) {
    this.selectedImageUrl = imageUrl ? 'http://localhost:8080' + imageUrl : '/property_placeholder.jpeg';
    this.showImageModal = true;
  }

  closeImageModal() {
    this.showImageModal = false;
  }
}