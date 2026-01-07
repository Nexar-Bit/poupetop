import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Offer } from '../../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private apiUrl = `${environment.apiUrl}/api/ofertas`;
  private itemsPerPage = 8; // 2 columns x 4 rows = 8 items per page
  private defaultImageUrl = 'https://meumercadohoje.com.br/assets/imgproduto.jpg';

  constructor(private http: HttpClient) {}

  /**
   * Get offers by municipio ID and optionally by establishment ID(s)
   * Supports multiple establishments by making separate calls and combining results
   * @param idMunicipio The municipio ID (city ID)
   * @param page Page number (1-based)
   * @param idEstabelecimentos Optional array of establishment IDs
   */
  getOffers(idMunicipio: number, page: number, idEstabelecimentos?: number[]): Observable<Offer[]> {
    // If no establishments specified, get all offers for the municipio
    if (!idEstabelecimentos || idEstabelecimentos.length === 0) {
      return this.getOffersByMunicipio(idMunicipio, page);
    }

    // If single establishment, use direct call
    if (idEstabelecimentos.length === 1) {
      return this.getOffersByMunicipioAndEstablishment(idMunicipio, idEstabelecimentos[0], page);
    }

    // If multiple establishments, fetch from each and combine
    return this.getOffersMultipleEstablishments(idMunicipio, idEstabelecimentos, page);
  }

  /**
   * Get offers by municipio only
   */
  private getOffersByMunicipio(idMunicipio: number, page: number): Observable<Offer[]> {
    const params = new HttpParams().set('idMunicipio', idMunicipio.toString());
    
    return this.http.get<Offer[]>(this.apiUrl, { params }).pipe(
      map(offers => this.setDefaultImages(offers)),
      map(offers => this.paginateOffers(offers, page))
    );
  }

  /**
   * Get offers by municipio and single establishment
   */
  private getOffersByMunicipioAndEstablishment(
    idMunicipio: number, 
    idEstabelecimento: number, 
    page: number
  ): Observable<Offer[]> {
    const params = new HttpParams()
      .set('idMunicipio', idMunicipio.toString())
      .set('idEstabelecimento', idEstabelecimento.toString());
    
    return this.http.get<Offer[]>(this.apiUrl, { params }).pipe(
      map(offers => this.setDefaultImages(offers)),
      map(offers => this.paginateOffers(offers, page))
    );
  }

  /**
   * Get offers from multiple establishments and combine results
   */
  private getOffersMultipleEstablishments(
    idMunicipio: number,
    idEstabelecimentos: number[],
    page: number
  ): Observable<Offer[]> {
    // Make parallel requests for each establishment
    const requests = idEstabelecimentos.map(idEstabelecimento =>
      this.getOffersByMunicipioAndEstablishment(idMunicipio, idEstabelecimento, 1).pipe(
        catchError(() => of([] as Offer[])) // Continue even if one fails
      )
    );

    return forkJoin(requests).pipe(
      map(results => {
        // Combine all offers and remove duplicates by ID
        const combinedOffers = results.flat();
        const uniqueOffers = this.removeDuplicateOffers(combinedOffers);
        
        // Set default images for offers without images
        const offersWithImages = this.setDefaultImages(uniqueOffers);
        
        // Sort by ID or price (you can customize this)
        offersWithImages.sort((a, b) => (a.id || 0) - (b.id || 0));
        
        // Paginate combined results
        return this.paginateOffers(offersWithImages, page);
      })
    );
  }

  /**
   * Remove duplicate offers based on ID
   */
  private removeDuplicateOffers(offers: Offer[]): Offer[] {
    const seen = new Set<number>();
    return offers.filter(offer => {
      if (offer.id && seen.has(offer.id)) {
        return false;
      }
      if (offer.id) {
        seen.add(offer.id);
      }
      return true;
    });
  }

  /**
   * Set default image for offers that don't have an image
   */
  private setDefaultImages(offers: Offer[]): Offer[] {
    return offers.map(offer => ({
      ...offer,
      image: offer.image && offer.image.trim() !== '' 
        ? offer.image 
        : this.defaultImageUrl
    }));
  }

  /**
   * Paginate offers array
   */
  private paginateOffers(offers: Offer[], page: number): Offer[] {
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return offers.slice(startIndex, endIndex);
  }

  /**
   * Get total number of offers for pagination
   * @param idMunicipio The municipio ID (city ID)
   * @param idEstabelecimentos Optional array of establishment IDs
   */
  getTotalOffers(idMunicipio: number, idEstabelecimentos?: number[]): Observable<number> {
    // If no establishments specified, get all offers for the municipio
    if (!idEstabelecimentos || idEstabelecimentos.length === 0) {
      return this.getTotalOffersByMunicipio(idMunicipio);
    }

    // If single establishment
    if (idEstabelecimentos.length === 1) {
      return this.getTotalOffersByMunicipioAndEstablishment(idMunicipio, idEstabelecimentos[0]);
    }

    // If multiple establishments, fetch from each and combine
    return this.getTotalOffersMultipleEstablishments(idMunicipio, idEstabelecimentos);
  }

  /**
   * Get total offers by municipio only
   */
  private getTotalOffersByMunicipio(idMunicipio: number): Observable<number> {
    const params = new HttpParams().set('idMunicipio', idMunicipio.toString());
    return this.http.get<Offer[]>(this.apiUrl, { params }).pipe(
      map(offers => offers.length)
    );
  }

  /**
   * Get total offers by municipio and establishment
   */
  private getTotalOffersByMunicipioAndEstablishment(
    idMunicipio: number,
    idEstabelecimento: number
  ): Observable<number> {
    const params = new HttpParams()
      .set('idMunicipio', idMunicipio.toString())
      .set('idEstabelecimento', idEstabelecimento.toString());
    return this.http.get<Offer[]>(this.apiUrl, { params }).pipe(
      map(offers => offers.length)
    );
  }

  /**
   * Get total offers from multiple establishments
   */
  private getTotalOffersMultipleEstablishments(
    idMunicipio: number,
    idEstabelecimentos: number[]
  ): Observable<number> {
    const requests = idEstabelecimentos.map(idEstabelecimento =>
      this.getTotalOffersByMunicipioAndEstablishment(idMunicipio, idEstabelecimento).pipe(
        catchError(() => of(0))
      )
    );

    return forkJoin(requests).pipe(
      map(totals => {
        // Sum all totals (or you could deduplicate if needed)
        return totals.reduce((sum, total) => sum + total, 0);
      })
    );
  }
}

