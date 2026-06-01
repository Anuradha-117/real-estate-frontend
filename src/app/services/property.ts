import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Property {
  private apiUrl = 'http://localhost:8080/api/properties';

  constructor(private http: HttpClient) { }

  getAllProperties(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  addProperty(propertyData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, propertyData);
  }

  updateProperty(id: number, propertyData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, propertyData);
  }

  deleteProperty(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
  
}