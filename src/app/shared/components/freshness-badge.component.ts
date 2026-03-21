import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { daysLeft, daysLeftText, freshnessLabel, freshnessTone } from '../../core/utils/date-utils';

@Component({
  selector: 'app-freshness-badge',
  standalone: true,
  imports: [MatIconModule, NgClass],
  template: `
    <span class="badge" [ngClass]="tone()">
      <mat-icon aria-hidden="true">{{ icon() }}</mat-icon>
      <span>{{ label() }}</span>
      <span class="detail">{{ text() }}</span>
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      min-height: 36px;
      padding: 0.35rem 0.65rem;
      border-radius: 999px;
      font-size: 0.82rem;
      font-weight: 700;
    }

    .detail {
      font-weight: 600;
      opacity: 0.88;
    }

    .danger {
      color: #7f1d1d;
      background: #fee2e2;
    }

    .warn {
      color: #854d0e;
      background: #fef3c7;
    }

    .ok {
      color: #14532d;
      background: #dcfce7;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FreshnessBadgeComponent {
  private readonly dateSignal = signal('');

  @Input({ required: true }) set expiresOn(value: string) {
    this.dateSignal.set(value);
  }

  readonly days = computed(() => daysLeft(this.dateSignal()));
  readonly label = computed(() => freshnessLabel(this.days()));
  readonly tone = computed(() => freshnessTone(this.days()));
  readonly text = computed(() => daysLeftText(this.days()));
  readonly icon = computed(() => {
    switch (this.label()) {
      case 'Expired':
        return 'error';
      case 'Use today':
      case 'Use soon':
        return 'schedule';
      default:
        return 'eco';
    }
  });
}
