import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { StudyModeService } from '../../core/services/study-mode.service';

@Component({
  selector: 'app-mode-toggle',
  standalone: true,
  imports: [MatButtonToggleModule, MatChipsModule],
  template: `
    <div class="mode-toggle">
      <mat-chip class="mode-chip" [highlighted]="true" [class.mode-b]="mode() === 'B'">
        Mode {{ mode() }}
      </mat-chip>
      <mat-button-toggle-group
        [value]="mode()"
        (change)="studyMode.setMode($event.value)"
        aria-label="Study mode"
      >
        <mat-button-toggle value="A">Standard</mat-button-toggle>
        <mat-button-toggle value="B">Expiration-aware</mat-button-toggle>
      </mat-button-toggle-group>
    </div>
  `,
  styles: [`
    .mode-toggle {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .mode-chip {
      font-weight: 700;
      color: var(--app-ink);
      background: rgba(17, 38, 53, 0.08);
    }

    .mode-chip.mode-b {
      background: rgba(192, 81, 45, 0.18);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModeToggleComponent {
  readonly studyMode = inject(StudyModeService);
  readonly mode = computed(() => this.studyMode.mode());
}
