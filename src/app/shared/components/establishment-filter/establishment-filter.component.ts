import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { Establishment } from '../../../models';
import { EstablishmentService } from '../../../core/services/establishment.service';

@Component({
  selector: 'app-establishment-filter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ScrollingModule
  ],
  templateUrl: './establishment-filter.component.html',
  styleUrl: './establishment-filter.component.scss'
})
export class EstablishmentFilterComponent implements OnInit, OnDestroy, OnChanges {
  @Input() cityId: number | null = null;
  @Input() selectedCity: { name: string; state: string } | null = null;
  @Output() establishmentsSelected = new EventEmitter<number[]>();

  searchControl = new FormControl('');
  autocompleteControl = new FormControl('');
  establishments: Establishment[] = [];
  filteredEstablishments: Establishment[] = [];
  filteredAutocompleteEstablishments: Establishment[] = [];
  selectedEstablishmentIds: Set<number> = new Set();
  selectedEstablishmentForFilter: Establishment | null = null;
  isLoading = false;
  hasError = false;
  private destroy$ = new Subject<void>();

  constructor(
    private establishmentService: EstablishmentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.cityId) {
      this.loadEstablishments();
    }

    // Setup search filtering for list
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map(query => query?.toLowerCase() || ''),
        takeUntil(this.destroy$)
      )
      .subscribe(query => {
        this.filterEstablishments(query);
      });

    // Setup autocomplete filtering (search as you type)
    this.autocompleteControl.valueChanges
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        map(query => {
          if (typeof query === 'string') {
            return query.toLowerCase().trim();
          }
          return '';
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(query => {
        this.filterAutocompleteEstablishments(query);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEstablishments(): void {
    if (!this.cityId) {
      this.establishments = [];
      this.filteredEstablishments = [];
      this.isLoading = false;
      this.hasError = false;
      this.cdr.markForCheck();
      return;
    }

    this.isLoading = true;
    this.hasError = false;
    this.cdr.markForCheck();

    this.establishmentService.getEstablishments(this.cityId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (establishments) => {
          this.establishments = establishments.map(est => ({
            ...est,
            selected: this.selectedEstablishmentIds.has(est.id)
          }));
          this.filteredEstablishments = [...this.establishments];
          this.filteredAutocompleteEstablishments = [...this.establishments];
          this.isLoading = false;
          this.hasError = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          // Service handles errors gracefully by returning empty array,
          // but keep this as a fallback just in case
          this.establishments = [];
          this.filteredEstablishments = [];
          this.isLoading = false;
          this.hasError = false; // Don't show error state since service returns empty array
          this.cdr.markForCheck();
        }
      });
  }

  filterEstablishments(query: string): void {
    if (!query) {
      this.filteredEstablishments = [...this.establishments];
      this.cdr.markForCheck();
      return;
    }

    this.filteredEstablishments = this.establishments.filter(est =>
      est.name.toLowerCase().includes(query)
    );
    this.cdr.markForCheck();
  }

  filterAutocompleteEstablishments(query: string): void {
    if (!query || query.length === 0) {
      this.filteredAutocompleteEstablishments = [...this.establishments];
      this.cdr.markForCheck();
      return;
    }

    // Filter establishments that start with query (priority) or contain query
    this.filteredAutocompleteEstablishments = this.establishments
      .filter(est => {
        const name = est.name.toLowerCase();
        return name.startsWith(query) || name.includes(query);
      })
      .sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(query);
        const bStarts = b.name.toLowerCase().startsWith(query);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.name.localeCompare(b.name);
      });
    this.cdr.markForCheck();
  }

  displayEstablishment(establishment: Establishment | string): string {
    if (typeof establishment === 'string') {
      return establishment;
    }
    return establishment ? establishment.name : '';
  }

  onEstablishmentSelectedFromAutocomplete(establishment: Establishment): void {
    this.selectedEstablishmentForFilter = establishment;
    this.autocompleteControl.setValue(establishment.name, { emitEvent: false });
    
    // Clear checkbox selections and select only this establishment
    this.selectedEstablishmentIds.clear();
    this.selectedEstablishmentIds.add(establishment.id);
    
    // Update checkbox states
    this.establishments.forEach(est => {
      est.selected = est.id === establishment.id;
    });
    
    this.emitSelectedEstablishments();
    this.cdr.markForCheck();
  }

  clearEstablishmentFilter(): void {
    this.selectedEstablishmentForFilter = null;
    this.autocompleteControl.setValue('', { emitEvent: false });
    this.selectedEstablishmentIds.clear();
    
    // Update checkbox states
    this.establishments.forEach(est => {
      est.selected = false;
    });
    
    this.emitSelectedEstablishments();
    this.cdr.markForCheck();
  }

  toggleEstablishment(establishment: Establishment): void {
    if (this.selectedEstablishmentIds.has(establishment.id)) {
      this.selectedEstablishmentIds.delete(establishment.id);
      establishment.selected = false;
    } else {
      this.selectedEstablishmentIds.add(establishment.id);
      establishment.selected = true;
    }

    this.emitSelectedEstablishments();
  }

  isSelected(establishmentId: number): boolean {
    return this.selectedEstablishmentIds.has(establishmentId);
  }

  private emitSelectedEstablishments(): void {
    const selectedIds = Array.from(this.selectedEstablishmentIds);
    this.establishmentsSelected.emit(selectedIds);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cityId']) {
      // Clear previous selections when city changes
      this.selectedEstablishmentIds.clear();
      this.selectedEstablishmentForFilter = null;
      this.searchControl.setValue('');
      this.autocompleteControl.setValue('');
      this.establishments = [];
      this.filteredEstablishments = [];
      this.filteredAutocompleteEstablishments = [];
      
      // Load establishments for the new city
      if (this.cityId) {
        this.loadEstablishments();
      } else {
        this.isLoading = false;
        this.hasError = false;
        this.cdr.markForCheck();
      }
    }
  }
}

