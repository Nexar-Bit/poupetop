import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BannerCarouselComponent } from './banner-carousel/banner-carousel.component';
import { CitySelectorComponent } from '../../shared/components/city-selector/city-selector.component';
import { EstablishmentFilterComponent } from '../../shared/components/establishment-filter/establishment-filter.component';
import { OffersGridComponent } from '../../shared/components/offers-grid/offers-grid.component';
import { PurchasesComponent } from '../purchases/purchases.component';
import { City } from '../../models';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    BannerCarouselComponent,
    CitySelectorComponent,
    EstablishmentFilterComponent,
    OffersGridComponent,
    PurchasesComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  selectedCity: City | null = null;
  selectedCityId: number | null = null;
  selectedEstablishmentIds: number[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Component initialization
  }

  onCitySelected(city: City): void {
    try {
      this.selectedCity = city;
      this.selectedCityId = city.id;
      // Reset establishment selection when city changes
      this.selectedEstablishmentIds = [];
      this.error = null;
      this.cdr.markForCheck();
    } catch (error) {
      this.handleError('Erro ao selecionar cidade', error);
    }
  }

  onEstablishmentSelected(establishmentIds: number[]): void {
    try {
      this.selectedEstablishmentIds = establishmentIds;
      this.error = null;
      this.cdr.markForCheck();
    } catch (error) {
      this.handleError('Erro ao selecionar estabelecimentos', error);
    }
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.error = message;
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}

