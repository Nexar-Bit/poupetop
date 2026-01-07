import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss'
})
export class SkeletonComponent {
  @Input() type: 'text' | 'card' | 'circle' | 'rect' = 'text';
  @Input() width: string = '100%';
  @Input() height: string = '1rem';
  @Input() count: number = 1;
}
