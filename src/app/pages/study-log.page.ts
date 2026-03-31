import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RecipesService } from '../core/services/recipes.service';
import { StudyLogEntry } from '../core/models';
import { StudyLogService } from '../core/services/study-log.service';
import { daysLeft, freshnessTone } from '../core/utils/date-utils';
import { normalizeName } from '../core/utils/scoring-utils';
import { FreshnessBadgeComponent } from '../shared/components/freshness-badge.component';

@Component({
  selector: 'app-study-log-page',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    TitleCasePipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    FreshnessBadgeComponent
  ],
  template: `
    <section class="shell page-shell">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Study Log</p>
          <h1>Submitted recipe choices</h1>
          <p class="subtle">Each entry stores the selected recipe, study mode, timestamp, pantry snapshot, and recipe ingredient list.</p>
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
            <h2>{{ recipeTitle(entry.chosenRecipeId) }}</h2>
            <p>{{ entry.chosenRecipeId }}</p>
            <p>Mode {{ entry.mode }} · {{ entry.timestamp | date: 'medium' }}</p>
          </div>
          <span class="snapshot-count">{{ entry.pantrySnapshot.length }} pantry items</span>
        </div>

        <div class="log-sections">
          <section class="log-section">
            <p class="section-label">Recipe ingredients</p>
            <div class="pill-list" *ngIf="recipeIngredients(entry.chosenRecipeId).length; else noIngredients">
              <span
                class="ingredient-pill"
                [class.danger]="ingredientTone(entry, ingredient) === 'danger'"
                [class.warn]="ingredientTone(entry, ingredient) === 'warn'"
                [class.ok]="ingredientTone(entry, ingredient) === 'ok'"
                [class.missing]="ingredientTone(entry, ingredient) === null"
                *ngFor="let ingredient of recipeIngredients(entry.chosenRecipeId)"
              >
                {{ ingredient | titlecase }}
              </span>
            </div>
            <ng-template #noIngredients>
              <p class="empty-copy">Recipe ingredients could not be loaded for this entry.</p>
            </ng-template>
          </section>

          <section class="log-section">
            <p class="section-label">Pantry snapshot</p>
            <div class="snapshot-list">
              <div class="snapshot-item" *ngFor="let item of entry.pantrySnapshot">
                <div class="snapshot-copy">
                  <strong>{{ item.name | titlecase }}</strong>
                  <span *ngIf="item.quantity">{{ item.quantity }}</span>
                  <span>Expires {{ item.expiresOn }}</span>
                </div>
                <app-freshness-badge [expiresOn]="item.expiresOn"></app-freshness-badge>
              </div>
            </div>
          </section>
        </div>
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

    .log-header p + p {
      margin-top: 0.25rem;
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
      background: var(--app-surface);
      box-shadow: none;
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

    .log-sections {
      display: grid;
      gap: 1rem;
    }

    .log-section {
      padding: 1rem;
      border-radius: 20px;
      background: #f4efe7;
    }

    .section-label {
      margin: 0;
      margin-bottom: 0.75rem;
      color: var(--app-muted);
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .pill-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.65rem;
    }

    .ingredient-pill {
      display: inline-flex;
      align-items: center;
      min-height: 38px;
      padding: 0.4rem 0.8rem;
      border-radius: 999px;
      background: rgba(252, 249, 242, 0.95);
      border: 1px solid rgba(17, 38, 53, 0.08);
      font-weight: 700;
    }

    .ingredient-pill.danger {
      color: #7f1d1d;
      background: #fee2e2;
      border-color: rgba(127, 29, 29, 0.15);
    }

    .ingredient-pill.warn {
      color: #854d0e;
      background: #fef3c7;
      border-color: rgba(133, 77, 14, 0.15);
    }

    .ingredient-pill.ok {
      color: #14532d;
      background: #dcfce7;
      border-color: rgba(20, 83, 45, 0.15);
    }

    .ingredient-pill.missing {
      color: var(--app-ink);
      background: rgba(252, 249, 242, 0.95);
    }

    .snapshot-list {
      display: grid;
      gap: 0.75rem;
    }

    .snapshot-item {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 0.9rem 1rem;
      border-radius: 18px;
      background: var(--app-surface);
      border: 1px solid rgba(17, 38, 53, 0.08);
      box-shadow: none;
    }

    .snapshot-copy {
      display: grid;
      gap: 0.15rem;
    }

    .snapshot-copy strong {
      font-size: 1rem;
    }

    .snapshot-copy span {
      color: var(--app-muted);
    }

    .empty-copy {
      margin: 0;
      color: var(--app-muted);
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

      .log-sections {
        grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
        align-items: start;
      }

      .snapshot-item {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudyLogPageComponent {
  readonly studyLog = inject(StudyLogService);
  private readonly recipesService = inject(RecipesService);
  private readonly snackBar = inject(MatSnackBar);

  recipeTitle(recipeId: string): string {
    return this.recipesService.getRecipeById(recipeId)?.title ?? recipeId;
  }

  recipeIngredients(recipeId: string): string[] {
    return this.recipesService.getRecipeById(recipeId)?.ingredients ?? [];
  }

  ingredientTone(entry: StudyLogEntry, ingredient: string): 'danger' | 'warn' | 'ok' | null {
    const pantryItem = entry.pantrySnapshot.find((item) => item.name === normalizeName(ingredient));
    return pantryItem ? freshnessTone(daysLeft(pantryItem.expiresOn)) : null;
  }

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
