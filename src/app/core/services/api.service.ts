import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  // Example method - customize as needed
  getData<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  postData<T>(url: string, data: any): Observable<T> {
    return this.http.post<T>(url, data);
  }
}

