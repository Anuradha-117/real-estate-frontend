import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InquiryService {
  private apiUrl = 'http://localhost:8080/api/inquiries';

  constructor(private http: HttpClient) { }
  submitInquiry(inquiryObj: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit`, inquiryObj);
  }

  getAllInquiries(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  getInquiriesForProperty(propertyId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/property/${propertyId}`);
  }
}