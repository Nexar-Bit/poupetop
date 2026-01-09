import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Purchase } from '../../models';
import { PurchaseService } from '../../core/services/purchase.service';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

interface GroupedPurchase {
  date: string;
  formattedDate: string;
  purchases: Purchase[];
}

@Component({
  selector: 'app-purchases',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    SkeletonComponent
  ],
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.scss'
})
export class PurchasesComponent implements OnInit, OnDestroy {
  groupedPurchases: GroupedPurchase[] = [];
  allPurchases: Purchase[] = [];
  currentPage = 1;
  itemsPerPage = 20;
  isLoading = false;
  hasMore = true;
  private destroy$ = new Subject<void>();

  constructor(
    private purchaseService: PurchaseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPurchases();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPurchases(): void {
    if (this.isLoading) {
      return;
    }

    if (!this.hasMore) {
      return;
    }

    this.isLoading = true;
    this.cdr.markForCheck();
    
    this.purchaseService.getPurchases(this.currentPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (purchases) => {
          if (purchases.length === 0) {
            this.hasMore = false;
          } else {
            this.allPurchases = [...this.allPurchases, ...purchases];
            this.groupPurchasesByDate();
            this.currentPage++;
            this.hasMore = purchases.length >= 10; // 10 items per page
          }
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          // Service should catch 500/404 errors and return empty array
          // This error handler is for unexpected errors only
          if (error.status !== 500 && error.status !== 404) {
            console.error('Error loading purchases:', error);
          }
          this.isLoading = false;
          this.hasMore = false;
          this.cdr.markForCheck();
        }
      });
  }

  groupPurchasesByDate(): void {
    const grouped = new Map<string, Purchase[]>();

    this.allPurchases.forEach(purchase => {
      const dateKey = purchase.date;
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(purchase);
    });

    this.groupedPurchases = Array.from(grouped.entries())
      .map(([date, purchases]) => ({
        date,
        formattedDate: this.formatDate(date),
        purchases: purchases.sort((a, b) => b.time.localeCompare(a.time)) // Sort by time descending
      }))
      .sort((a, b) => b.date.localeCompare(a.date)); // Sort by date descending
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString + 'T00:00:00');
    const months = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];

    return `${day} de ${month}`;
  }

  formatPrice(amount: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  }

  getCategoryIcon(category: string): string {
    const iconMap: { [key: string]: string } = {
      'Alimentação': 'restaurant',
      'Saúde': 'local_hospital',
      'Vestuário': 'checkroom',
      'Eletrônicos': 'devices',
      'Pet': 'pets',
      'Educação': 'school',
      'Outros': 'shopping_bag'
    };

    return iconMap[category] || 'shopping_bag';
  }

  loadMore(): void {
    this.loadPurchases();
  }
}

