import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Property {
  private apiUrl = 'http://localhost:8080/api/properties/all';

  constructor(private http: HttpClient) { }

  getAllProperties(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}