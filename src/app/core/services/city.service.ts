import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { City, MunicipioApiResponse } from '../../models';
import { environment } from '../../../environments/environment';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // milliseconds
}

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private apiUrl = `${environment.apiUrl}/api/municipios`;
  private cacheExpiration = 24 * 60 * 60 * 1000; // 24 hours
  private allCitiesCache: CacheEntry<City[]> | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Maps API response to City interface
   */
  private mapToCity(municipio: MunicipioApiResponse): City {
    return {
      id: municipio.id,
      name: municipio.nomeMunicipio,
      state: municipio.siglaEstado,
      nomeMunicipio: municipio.nomeMunicipio,
      siglaEstado: municipio.siglaEstado,
      nomeEstado: municipio.nomeEstado
    };
  }

  searchCities(query: string): Observable<City[]> {
    if (!query || query.trim().length === 0) {
      // Return all cities if query is empty
      return this.getAllCities();
    }

    const trimmedQuery = query.trim();
    
    return this.http.get<MunicipioApiResponse[]>(this.apiUrl).pipe(
      map(municipios => {
        // Client-side filtering by nomeMunicipio
        const lowerQuery = trimmedQuery.toLowerCase();
        const filtered = municipios.filter(municipio => {
          const municipioName = municipio.nomeMunicipio.toLowerCase();
          const estadoSigla = municipio.siglaEstado.toLowerCase();
          // Match if query appears at the start of municipio name (priority) or anywhere
          const startsWithName = municipioName.startsWith(lowerQuery);
          const includesName = municipioName.includes(lowerQuery);
          const includesEstado = estadoSigla.includes(lowerQuery);
          
          return startsWithName || includesName || includesEstado;
        });
        
        // Map to City interface
        const cities = filtered.map(m => this.mapToCity(m));
        
        // Sort: cities starting with query first, then alphabetically
        return cities.sort((a, b) => {
          const aName = a.name.toLowerCase();
          const bName = b.name.toLowerCase();
          const aStarts = aName.startsWith(lowerQuery);
          const bStarts = bName.startsWith(lowerQuery);
          
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return a.name.localeCompare(b.name);
        });
      })
    );
  }

  getAllCities(): Observable<City[]> {
    // Check cache first
    if (this.allCitiesCache && this.isCacheValid(this.allCitiesCache)) {
      return of(this.allCitiesCache.data);
    }

    // Fetch from API and cache
    return this.http.get<MunicipioApiResponse[]>(this.apiUrl).pipe(
      map(municipios => {
        const cities = municipios.map(m => this.mapToCity(m));
        return cities.sort((a, b) => a.name.localeCompare(b.name));
      }),
      tap(cities => {
        // Cache the result
        this.allCitiesCache = {
          data: cities,
          timestamp: Date.now(),
          expiresIn: this.cacheExpiration
        };
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
   * Clear cache (useful for testing or forced refresh)
   */
  clearCache(): void {
    this.allCitiesCache = null;
  }
}

