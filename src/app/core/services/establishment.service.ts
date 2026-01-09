import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Establishment } from '../../models';
import { environment } from '../../../environments/environment';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // milliseconds
}

@Injectable({
  providedIn: 'root'
})
export class EstablishmentService {
  private apiUrl = `${environment.apiUrl}/estabelecimentos`;
  private cacheExpiration = 60 * 60 * 1000; // 1 hour (establishments change more frequently)
  private establishmentsCache = new Map<number, CacheEntry<Establishment[]>>();

  constructor(private http: HttpClient) {}

  /**
   * Get establishments by municipio ID
   * @param idMunicipio The municipio ID (city ID)
   */
  getEstablishments(idMunicipio: number): Observable<Establishment[]> {
    // Check cache first
    const cached = this.establishmentsCache.get(idMunicipio);
    if (cached && this.isCacheValid(cached)) {
      return of(cached.data);
    }

    // Fetch from API and cache
    const params = new HttpParams().set('idMunicipio', idMunicipio.toString());
    return this.http.get<Establishment[]>(this.apiUrl, { params }).pipe(
      tap(establishments => {
        // Cache the result
        this.establishmentsCache.set(idMunicipio, {
          data: establishments,
          timestamp: Date.now(),
          expiresIn: this.cacheExpiration
        });
      }),
      catchError((error) => {
        // Handle JSON parsing errors (e.g., when server returns HTML instead of JSON)
        // or other API errors
        console.debug('Error loading establishments:', error.status, error.statusText);
        // Clear cache for this municipio if there was an error
        this.establishmentsCache.delete(idMunicipio);
        // Return empty array on error
        return of([]);
      })
    );
  }

  /**
   * Check if cache entry is still valid
   */
  private isCacheValid<T>(cache: CacheEntry<T>): boolean {
    const now = Date.now();
    return (now - cache.timestamp) < cache.expiresIn;
  }

  /**
   * Clear cache for a specific municipio or all
   * @param idMunicipio Optional municipio ID to clear specific cache, or undefined to clear all
   */
  clearCache(idMunicipio?: number): void {
    if (idMunicipio !== undefined) {
      this.establishmentsCache.delete(idMunicipio);
    } else {
      this.establishmentsCache.clear();
    }
  }
}

