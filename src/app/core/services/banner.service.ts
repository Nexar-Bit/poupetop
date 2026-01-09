import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Banner } from '../../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private apiUrl = `${environment.apiUrl}/api/banners`;

  constructor(private http: HttpClient) {}

  getBanners(): Observable<Banner[]> {
    return this.http.get<Banner[]>(this.apiUrl).pipe(
      catchError((error) => {
        // Endpoint may not be implemented yet - return empty array gracefully
        if (error.status === 500 || error.status === 404) {
          console.debug('Banners endpoint not available yet:', error.status);
          return of([]);
        }
        // Re-throw other errors to be handled by the error interceptor
        throw error;
      })
    );
  }
}

