import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StudyLogService } from '../core/services/study-log.service';

@Component({
  selector: 'app-study-log-page',
  standalone: true,
  imports: [CommonModule, JsonPipe, MatButtonModule, MatCardModule, MatIconModule, MatSnackBarModule],
  template: `
    <section class="shell page-shell">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Study Log</p>
          <h1>Submitted recipe choices</h1>
          <p class="subtle">Each entry stores the selected recipe, study mode, timestamp, and pantry snapshot.</p>
        </div>
        <div class="action-row">
          <button mat-stroked-button (click)="copyJson()" [disabled]="!studyLog.logs().length">Copy JSON</button>
          <button mat-stroked-button (click)="downloadJson()" [disabled]="!studyLog.logs().length">Export JSON</button>
          <button mat-button color="warn" (click)="studyLog.clear()" [disabled]="!studyLog.logs().length">Clear Logs</button>
        </div>
      </div>

      <mat-card *ngIf="!studyLog.logs().length" class="empty-card">
        <mat-icon>fact_check</mat-icon>
        <h2>No study data yet</h2>
        <p>Submit a recipe choice from the recipe detail screen to populate the study log.</p>
      </mat-card>

      <mat-card *ngFor="let entry of studyLog.logs()" class="log-card">
        <div class="log-header">
          <div>
            <h2>{{ entry.chosenRecipeId }}</h2>
            <p>Mode {{ entry.mode }} · {{ entry.timestamp }}</p>
          </div>
          <span class="snapshot-count">{{ entry.pantrySnapshot.length }} pantry items</span>
        </div>

        <pre>{{ entry | json }}</pre>
      </mat-card>
    </section>
  `,
  styles: [`
    .page-shell {
      display: grid;
      gap: 1rem;
      padding-top: 1rem;
      padding-bottom: 1rem;
    }

    .section-heading {
      display: grid;
      gap: 1rem;
    }

    .eyebrow {
      margin: 0 0 0.4rem;
      color: var(--app-accent);
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    h1, h2 {
      margin: 0;
    }

    .subtle,
    .log-header p {
      color: var(--app-muted);
    }

    .action-row {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .empty-card,
    .log-card {
      padding: 1rem;
      border-radius: 24px;
    }

    .empty-card {
      display: grid;
      justify-items: start;
      gap: 0.75rem;
    }

    .log-header {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }

    .snapshot-count {
      display: inline-flex;
      align-items: center;
      min-height: 36px;
      padding: 0.35rem 0.75rem;
      border-radius: 999px;
      background: rgba(47, 111, 83, 0.12);
      font-weight: 700;
      width: fit-content;
    }

    pre {
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
      font-size: 0.82rem;
      line-height: 1.5;
      color: var(--app-ink);
      background: rgba(17, 38, 53, 0.04);
      border-radius: 18px;
      padding: 1rem;
      overflow: auto;
    }

    @media (min-width: 900px) {
      .section-heading {
        grid-template-columns: 1.4fr auto;
        align-items: end;
      }

      .log-header {
        flex-direction: row;
        align-items: start;
        justify-content: space-between;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudyLogPageComponent {
  readonly studyLog = inject(StudyLogService);
  private readonly snackBar = inject(MatSnackBar);

  copyJson(): void {
    navigator.clipboard.writeText(this.studyLog.exportJson()).then(() => {
      this.snackBar.open('Study log copied to clipboard.', 'Close', { duration: 3000 });
    });
  }

  downloadJson(): void {
    const blob = new Blob([this.studyLog.exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'mypantrypal-study-log.json';
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
