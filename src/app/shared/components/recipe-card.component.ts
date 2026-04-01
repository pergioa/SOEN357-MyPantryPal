import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { PantryService } from '../../core/services/pantry.service';
import { ScoredRecipe, StudyMode } from '../../core/models';
import { FreshnessTone, daysLeft, freshnessTone } from '../../core/utils/date-utils';
import { normalizeName } from '../../core/utils/scoring-utils';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [
    CommonModule,
    TitleCasePipe,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatExpansionModule,
    MatIconModule
  ],
  template: `
    <mat-card class="recipe-card">
      <section class="card-section card-section-header">
        <mat-card-header>
          <mat-card-title>{{ scored.recipe.title }}</mat-card-title>
          <mat-card-subtitle>
            {{ scored.recipe.minutes }} min · {{ scored.recipe.difficulty }}
          </mat-card-subtitle>
        </mat-card-header>
      </section>

      <mat-card-content>
        <section class="card-section card-section-meta">
          <div class="chip-row">
            <mat-chip-set>
              <mat-chip>{{ scored.presentIngredients.length }} / {{ scored.recipe.ingredients.length }} ingredients</mat-chip>
              <mat-chip *ngFor="let tag of scored.recipe.tags">{{ tag }}</mat-chip>
              <mat-chip
                *ngIf="mode === 'B' && scored.soonIngredients.length"
                class="use-soon-chip"
                [class.use-soon-chip-danger]="warningTone() === 'danger'"
                [class.use-soon-chip-warn]="warningTone() === 'warn'"
              >
                <mat-icon>warning</mat-icon>
                Use Soon
              </mat-chip>
            </mat-chip-set>
          </div>
        </section>

        <section class="card-section card-section-summary">
          <p class="section-label">Pantry match</p>
          <p class="summary" *ngIf="scored.presentIngredients.length; else noMatches">
            Uses:
            <span *ngFor="let ingredient of scored.presentIngredients; let last = last">
              <span
                [class.soon-ingredient-danger]="ingredientTone(ingredient) === 'danger'"
                [class.soon-ingredient-warn]="ingredientTone(ingredient) === 'warn'"
              >
                {{ ingredient | titlecase }}
              </span><span *ngIf="!last">, </span>
            </span>
          </p>
          <ng-template #noMatches>
            <p class="summary">No pantry matches yet. Add ingredients or load sample items to improve recommendations.</p>
          </ng-template>
        </section>

        <section class="card-section card-section-missing">
          <mat-expansion-panel [disabled]="!scored.missingIngredients.length">
            <mat-expansion-panel-header>
              <mat-panel-title>Missing ingredients</mat-panel-title>
              <mat-panel-description>
                {{ scored.missingIngredients.length ? scored.missingIngredients.length + ' needed' : 'N/A' }}
              </mat-panel-description>
            </mat-expansion-panel-header>
            <p *ngIf="scored.missingIngredients.length; else noMissing">
              {{ scored.missingIngredients.join(', ') | titlecase }}
            </p>
            <ng-template #noMissing>
              <p>You already have everything for this recipe.</p>
            </ng-template>
          </mat-expansion-panel>
        </section>
      </mat-card-content>

      <mat-card-actions class="card-section card-section-actions">
        <button mat-stroked-button (click)="viewDetails.emit(scored.recipe.id)">View details</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .recipe-card {
      position: relative;
      overflow: hidden;
      height: 100%;
      display: grid;
      grid-template-rows: auto 1fr auto;
      border-radius: 26px;
      background:
        linear-gradient(180deg, rgba(252, 249, 242, 0.98), rgba(255, 250, 244, 0.94)),
        var(--app-surface);
      box-shadow: 0 18px 40px rgba(17, 38, 53, 0.08);
      transition: transform 220ms ease, box-shadow 220ms ease;
    }

    .recipe-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 26px 54px rgba(17, 38, 53, 0.12);
    }

    .card-section {
      position: relative;
      padding: 0 16px;
    }

    .card-section + .card-section::before {
      content: '';
      position: absolute;
      inset: 0 16px auto;
      border-top: 1px solid rgba(17, 38, 53, 0.08);
    }

    .card-section-header {
      padding-top: 16px;
      padding-bottom: 10px;
    }

    mat-card-header {
      margin-bottom: 0;
      align-items: start;
      min-height: 76px;
    }

    mat-card-title {
      line-height: 1.1;
      word-break: break-word;
    }

    mat-card-subtitle {
      color: var(--app-muted);
      white-space: normal;
    }

    mat-card-content {
      display: grid;
      grid-template-rows: auto minmax(132px, 1fr) auto;
      align-content: start;
      padding: 0;
    }

    .card-section-meta {
      padding-top: 12px;
      padding-bottom: 14px;
      min-height: 124px;
    }

    .chip-row {
      margin: 0;
      min-height: 100%;
      display: flex;
      align-items: start;
    }

    .chip-row mat-chip-set {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .chip-row mat-chip {
      max-width: 100%;
    }

    .card-section-summary {
      padding-top: 14px;
      padding-bottom: 18px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      min-height: 0;
    }

    .section-label {
      margin: 0 0 0.45rem;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--app-muted);
    }

    .summary {
      margin: 0;
      color: var(--app-muted);
      line-height: 1.55;
      word-break: break-word;
    }

    .use-soon-chip.use-soon-chip-danger {
      background: #fee2e2;
      color: #7f1d1d;
    }

    .use-soon-chip.use-soon-chip-warn {
      background: #fef3c7;
      color: #9a7a00;
    }

    .soon-ingredient-danger {
      font-weight: 700;
      color: #9a3412;
    }

    .soon-ingredient-warn {
      font-weight: 700;
      color: #9a7a00;
    }

    .card-section-missing {
      padding-top: 14px;
      padding-bottom: 8px;
    }

    mat-expansion-panel {
      overflow: hidden;
      border-radius: 20px;
      box-shadow: none;
      border: 1px solid rgba(17, 38, 53, 0.08);
      background: rgba(236, 234, 239, 0.55);
    }

    mat-expansion-panel-header {
      min-height: 72px;
      height: auto;
      padding-top: 0.35rem;
      padding-bottom: 0.35rem;
    }

    ::ng-deep .recipe-card .mat-expansion-panel-header-content {
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    mat-panel-title,
    mat-panel-description {
      white-space: normal;
      line-height: 1.3;
      word-break: break-word;
      margin: 0;
    }

    mat-panel-title {
      min-width: 0;
      flex: 1 1 140px;
    }

    mat-panel-description {
      justify-content: flex-start;
      min-width: 0;
      flex: 0 1 120px;
    }

    mat-card-actions {
      padding-top: 14px;
      padding-bottom: 24px;
      margin-top: 0;
    }

    @media (max-width: 420px) {
      mat-card-title {
        font-size: 1.85rem;
      }

      mat-card-subtitle {
        font-size: 0.95rem;
      }

      mat-card-header {
        min-height: 0;
      }

      mat-expansion-panel-header {
        padding-left: 12px;
        padding-right: 12px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeCardComponent {
  private readonly pantryService = inject(PantryService);

  @Input({ required: true }) scored!: ScoredRecipe;
  @Input({ required: true }) mode!: StudyMode;
  @Output() viewDetails = new EventEmitter<string>();

  ingredientTone(ingredient: string): FreshnessTone | null {
    if (this.mode !== 'B') {
      return null;
    }

    const pantryItem = this.pantryService.pantry().find((item) => item.name === normalizeName(ingredient));
    if (!pantryItem) {
      return null;
    }

    const tone = freshnessTone(daysLeft(pantryItem.expiresOn));
    return tone === 'ok' ? null : tone;
  }

  warningTone(): FreshnessTone | null {
    if (this.mode !== 'B' || !this.scored?.soonIngredients.length) {
      return null;
    }

    const tones = this.scored.soonIngredients
      .map((ingredient) => this.ingredientTone(ingredient))
      .filter((tone): tone is FreshnessTone => tone !== null);

    if (tones.includes('danger')) {
      return 'danger';
    }

    if (tones.includes('warn')) {
      return 'warn';
    }

    return null;
  }
}
