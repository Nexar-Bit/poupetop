import { Component, OnInit, Output, EventEmitter, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, startWith } from 'rxjs/operators';
import { City } from '../../../models';
import { CityService } from '../../../core/services/city.service';

@Component({
  selector: 'app-city-selector',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './city-selector.component.html',
  styleUrl: './city-selector.component.scss'
})
export class CitySelectorComponent implements OnInit, OnDestroy {
  @Output() citySelected = new EventEmitter<City>();

  cityControl = new FormControl('');
  filteredCities$: Observable<City[]> = new Observable<City[]>();
  private destroy$ = new Subject<void>();
  private allCities$: Observable<City[]> = of([]);

  constructor(private cityService: CityService) {}

  ngOnInit(): void {
    // Load all cities initially
    this.allCities$ = this.cityService.getAllCities();

    // Load saved city from localStorage
    const savedCity = this.getSavedCity();
    if (savedCity) {
      this.cityControl.setValue(savedCity.name, { emitEvent: false });
      this.citySelected.emit(savedCity);
    }

    // Setup debounced search with instant feedback (similar to webmotors.com.br)
    this.filteredCities$ = this.cityControl.valueChanges.pipe(
      startWith(''),
      debounceTime(150), // Reduced debounce for faster response
      distinctUntilChanged(),
      switchMap(query => {
        const queryString = typeof query === 'string' ? query : '';
        if (queryString && queryString.trim().length > 0) {
          // Search with any character entered (similar to webmotors behavior)
          return this.cityService.searchCities(queryString);
        }
        // Show all cities when input is empty
        return this.allCities$;
      }),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  displayCity(city: City | string): string {
    if (typeof city === 'string') {
      return city;
    }
    if (!city) {
      return '';
    }
    // Display format: "NomeMunicipio, SiglaEstado" (e.g., "Cabixi, RO")
    const municipioName = city.nomeMunicipio || city.name;
    const estadoSigla = city.siglaEstado || city.state;
    return `${municipioName}, ${estadoSigla}`;
  }

  onCitySelected(city: City): void {
    // Set the display value in the format "NomeMunicipio, SiglaEstado"
    const displayValue = this.displayCity(city);
    this.cityControl.setValue(displayValue, { emitEvent: false });
    this.saveCity(city);
    this.citySelected.emit(city);
  }

  onInputFocus(): void {
    // Trigger search to show all cities when input is focused (similar to webmotors)
    const currentValue = this.cityControl.value;
    if (!currentValue || (typeof currentValue === 'string' && currentValue.trim().length === 0)) {
      // Force update to show all cities by triggering valueChanges
      const currentVal = this.cityControl.value || '';
      this.cityControl.setValue('', { emitEvent: false });
      setTimeout(() => {
        this.cityControl.setValue(currentVal, { emitEvent: true });
      }, 0);
    }
  }

  private saveCity(city: City): void {
    localStorage.setItem('selectedCity', JSON.stringify(city));
  }

  private getSavedCity(): City | null {
    const saved = localStorage.getItem('selectedCity');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  }
}

