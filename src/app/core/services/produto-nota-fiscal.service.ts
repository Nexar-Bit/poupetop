import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProdutoNotaFiscal {
  id?: number;
  [key: string]: any; // Flexible interface for API response
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoNotaFiscalService {
  private apiUrl = `${environment.apiUrl}/produtos-nota-fiscal`;

  constructor(private http: HttpClient) {}

  /**
   * Get products from receipt (nota fiscal) with pagination
   * @param page Page number (0-based)
   */
  getProdutosNotaFiscal(page: number = 0): Observable<ProdutoNotaFiscal[]> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<ProdutoNotaFiscal[]>(this.apiUrl, { params });
  }
}
