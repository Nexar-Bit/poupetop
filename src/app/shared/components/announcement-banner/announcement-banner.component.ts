import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-announcement-banner',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './announcement-banner.component.html',
  styleUrl: './announcement-banner.component.scss'
})
export class AnnouncementBannerComponent {
}

