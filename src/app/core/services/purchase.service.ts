import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Purchase } from '../../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private apiUrl = `${environment.apiUrl}/api/purchases`;

  constructor(private http: HttpClient) {}

  getPurchases(page: number): Observable<Purchase[]> {
    // InMemoryWebApi doesn't support _page/_limit directly, so we fetch all and paginate client-side
    return this.http.get<Purchase[]>(this.apiUrl).pipe(
      map((purchases: Purchase[]) => {
        // Sort by date descending, then by time descending
        const sorted = purchases.sort((a, b) => {
          const dateCompare = b.date.localeCompare(a.date);
          if (dateCompare !== 0) return dateCompare;
          return b.time.localeCompare(a.time);
        });
        
        // Paginate: 10 items per page
        const itemsPerPage = 10;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        return sorted.slice(startIndex, endIndex);
      })
    );
  }
}

