import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Banner } from '../../../models';
import { BannerService } from '../../../core/services/banner.service';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-banner-carousel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    SkeletonComponent
  ],
  templateUrl: './banner-carousel.component.html',
  styleUrl: './banner-carousel.component.scss'
})
export class BannerCarouselComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;
  
  banners: Banner[] = [];
  isLoading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private bannerService: BannerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.bannerService.getBanners()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (banners) => {
          this.banners = banners;
          this.isLoading = false;
          this.cdr.markForCheck();
          // Configure autoplay after banners are loaded
          setTimeout(() => this.configureAutoplay(), 100);
        },
        error: () => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

  ngAfterViewInit(): void {
    // Configure autoplay when view is initialized
    if (this.banners.length > 0) {
      setTimeout(() => this.configureAutoplay(), 100);
    }
  }

  private configureAutoplay(): void {
    if (this.swiperContainer?.nativeElement) {
      const swiper = this.swiperContainer.nativeElement;
      // Ensure autoplay is enabled with proper configuration
      swiper.setAttribute('autoplay', 'true');
      swiper.setAttribute('autoplay-delay', '5000');
      swiper.setAttribute('autoplay-disable-on-interaction', 'false');
      swiper.setAttribute('loop', 'true');
      swiper.setAttribute('speed', '500');
      swiper.setAttribute('touch-events-target', 'container');
      swiper.setAttribute('allow-touch-move', 'true');
      swiper.setAttribute('grab-cursor', 'true');
      
      // Force Swiper to reinitialize if needed
      if (swiper.swiper) {
        swiper.swiper.update();
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

