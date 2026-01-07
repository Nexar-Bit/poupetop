import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Banner } from '../../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private apiUrl = `${environment.apiUrl}/api/banners`;

  constructor(private http: HttpClient) {}

  getBanners(): Observable<Banner[]> {
    return this.http.get<Banner[]>(this.apiUrl);
  }
}

