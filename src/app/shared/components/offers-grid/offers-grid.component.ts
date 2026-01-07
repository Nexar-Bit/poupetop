import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, HostListener, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Offer } from '../../../models';
import { OfferService } from '../../../core/services/offer.service';
import { SkeletonComponent } from '../skeleton/skeleton.component';

@Component({
  selector: 'app-offers-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    SkeletonComponent
  ],
  templateUrl: './offers-grid.component.html',
  styleUrl: './offers-grid.component.scss'
})
export class OffersGridComponent implements OnInit, OnDestroy, OnChanges {
  @Input() cityId: number | null = null;
  @Input() establishmentIds: number[] = [];

  @ViewChild('gridContainer', { static: false }) gridContainer!: ElementRef;

  offers: Offer[] = [];
  defaultOffers: Offer[] = [];
  currentPage = 1;
  itemsPerPage = 8;
  totalItems = 0;
  totalPages = 0;
  isLoading = false;
  isRefreshing = false;
  pullDistance = 0;
  isPulling = false;
  startY = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private offerService: OfferService,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDefaultOffers();
    if (this.cityId) {
      this.loadOffers();
      this.loadTotalOffers();
    }
  }

  loadDefaultOffers(): void {
    // Default offers with post images - shown when no city is selected
    // Encode % character to %25 to avoid URI malformed errors
    const encodeImagePath = (path: string): string => {
      return path.replace(/%/g, '%25');
    };

    const postImages = [
      encodeImagePath('/assets/posts/Instagram Post - Beauty 30%.png'),
      encodeImagePath('/assets/posts/Instagram Post - Café 20%.png'),
      encodeImagePath('/assets/posts/Instagram Post - Fitness Gratis.png'),
      encodeImagePath('/assets/posts/Instagram Post - Restaurante 25%.png'),
      encodeImagePath('/assets/posts/Instagram Post - Tech 25%.png')
    ];

    this.defaultOffers = [
      { id: 101, productName: 'Slip On Aramis Daily', establishmentName: 'Loja de Calçados', establishmentId: 0, price: 169.99, image: postImages[2], originalPrice: 339.98 },
      { id: 102, productName: 'Tênis Coca Cola Houston', establishmentName: 'Loja de Calçados', establishmentId: 0, price: 144.99, image: postImages[2], originalPrice: 258.91 },
      { id: 103, productName: 'Tênis Reserva Recorte Preto', establishmentName: 'Loja de Calçados', establishmentId: 0, price: 329.99, image: postImages[2], originalPrice: 388.22 },
      { id: 104, productName: 'Camisa Po Dudalina R', establishmentName: 'Loja de Roupas Fashion', establishmentId: 0, price: 134.99, image: postImages[0], originalPrice: 179.99 },
      { id: 105, productName: 'Produto Premium', establishmentName: 'Supermercado Central', establishmentId: 0, price: 89.90, image: postImages[1], originalPrice: 119.90 },
      { id: 106, productName: 'Oferta Especial', establishmentName: 'Restaurante Sabor', establishmentId: 0, price: 35.90, image: postImages[3], originalPrice: 49.90 },
      { id: 107, productName: 'Promoção Imperdível', establishmentName: 'Farmácia Saúde', establishmentId: 0, price: 45.90, image: postImages[0], originalPrice: 65.90 },
      { id: 108, productName: 'Produto em Destaque', establishmentName: 'Eletrônicos Tech', establishmentId: 0, price: 299.90, image: postImages[4], originalPrice: 399.90 }
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cityId'] || changes['establishmentIds']) {
      this.currentPage = 1;
      if (this.cityId) {
        this.loadOffers();
        this.loadTotalOffers();
      } else {
        // Reset to default offers when city is deselected
        this.offers = [...this.defaultOffers];
        this.totalItems = this.defaultOffers.length;
        this.totalPages = Math.ceil(this.defaultOffers.length / this.itemsPerPage);
        this.cdr.markForCheck();
      }
    }
    
    // Reload offers when establishment filter changes
    if (changes['establishmentIds'] && this.cityId) {
      this.currentPage = 1;
      this.loadOffers();
      this.loadTotalOffers();
    }
  }

  loadOffers(): void {
    if (!this.cityId) {
      return;
    }

    this.isLoading = true;
    this.cdr.markForCheck();

    // Use establishment IDs if provided, otherwise get all for city
    const establishmentIds = this.establishmentIds.length > 0 
      ? this.establishmentIds 
      : undefined;

    this.offerService.getOffers(this.cityId, this.currentPage, establishmentIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (offers) => {
          // Service already returns 8 items per page, use them directly
          this.offers = offers;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

  loadTotalOffers(): void {
    if (!this.cityId) {
      return;
    }

    // Use establishment IDs if provided, otherwise get all for city
    const establishmentIds = this.establishmentIds.length > 0 
      ? this.establishmentIds 
      : undefined;

    this.offerService.getTotalOffers(this.cityId, establishmentIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe(total => {
        this.totalItems = total;
        this.totalPages = Math.ceil(total / this.itemsPerPage);
        this.cdr.markForCheck();
      });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadOffers();
      // Scroll to top of grid
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  getVisiblePages(): number[] {
    const maxVisible = 5; // Show max 5 page numbers on mobile
    const pages: number[] = [];
    
    if (this.totalPages <= maxVisible) {
      // Show all pages if total is less than max
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(this.totalPages, start + maxVisible - 1);
      
      // Adjust start if we're near the end
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  calculateDiscount(price: number, originalPrice: number): number {
    if (!originalPrice || originalPrice <= price) {
      return 0;
    }
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  getPullTransform(): string {
    return `translateY(${Math.min(this.pullDistance, 80)}px)`;
  }

  // Pull-to-refresh handlers
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (window.scrollY === 0 && event.touches.length === 1) {
      this.startY = event.touches[0].clientY;
      this.isPulling = true;
    }
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (!this.isPulling || this.isRefreshing) return;

    const currentY = event.touches[0].clientY;
    this.pullDistance = Math.max(0, currentY - this.startY);

    if (this.pullDistance > 0 && window.scrollY === 0) {
      event.preventDefault();
    }
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    if (!this.isPulling) return;

    if (this.pullDistance > 80 && !this.isRefreshing) {
      this.refreshOffers();
    }

    this.pullDistance = 0;
    this.isPulling = false;
    this.startY = 0;
  }

  refreshOffers(): void {
    if (this.isRefreshing || !this.cityId) return;

    this.isRefreshing = true;
    this.currentPage = 1;
    
    this.loadOffers();
    this.loadTotalOffers();

    setTimeout(() => {
      this.isRefreshing = false;
    }, 1000);
  }
}

