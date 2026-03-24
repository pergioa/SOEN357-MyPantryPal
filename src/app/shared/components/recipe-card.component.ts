import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { ScoredRecipe } from '../../core/models';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [
    CommonModule,
    TitleCasePipe,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatExpansionModule
  ],
  template: `
    <mat-card class="recipe-card">
      <div class="recipe-accent"></div>
      <mat-card-header>
        <div mat-card-avatar class="card-avatar">{{ scored.recipe.title.charAt(0) }}</div>
        <mat-card-title>{{ scored.recipe.title }}</mat-card-title>
        <mat-card-subtitle>
          {{ scored.recipe.minutes }} min · {{ scored.recipe.difficulty }}
        </mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <div class="chip-row">
          <mat-chip-set>
            <mat-chip>{{ scored.presentIngredients.length }} / {{ scored.recipe.ingredients.length }} ingredients</mat-chip>
            <mat-chip *ngFor="let tag of scored.recipe.tags">{{ tag }}</mat-chip>
          </mat-chip-set>
        </div>

        <p class="summary" *ngIf="scored.presentIngredients.length; else noMatches">
          Uses:
          <span *ngFor="let ingredient of scored.presentIngredients; let last = last">
            <span>{{ ingredient | titlecase }}</span><span *ngIf="!last">, </span>
          </span>
        </p>
        <ng-template #noMatches>
          <p class="summary">No pantry matches yet. Add ingredients or load sample items to improve recommendations.</p>
        </ng-template>

        <mat-expansion-panel [disabled]="!scored.missingIngredients.length">
          <mat-expansion-panel-header>
            <mat-panel-title>Missing ingredients</mat-panel-title>
            <mat-panel-description>
              {{ scored.missingIngredients.length ? scored.missingIngredients.length + ' needed' : 'Complete match' }}
            </mat-panel-description>
          </mat-expansion-panel-header>
          <p *ngIf="scored.missingIngredients.length; else noMissing">
            {{ scored.missingIngredients.join(', ') | titlecase }}
          </p>
          <ng-template #noMissing>
            <p>You already have everything for this recipe.</p>
          </ng-template>
        </mat-expansion-panel>
      </mat-card-content>

      <mat-card-actions>
        <button mat-stroked-button (click)="viewDetails.emit(scored.recipe.id)">View details</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .recipe-card {
      position: relative;
      overflow: hidden;
      height: 100%;
      display: flex;
      flex-direction: column;
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

    .recipe-accent {
      position: absolute;
      inset: 0 0 auto 0;
      height: 6px;
      background: linear-gradient(90deg, #2f6f53, #d9982d, #c0512d);
    }

    .card-avatar {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      font-weight: 700;
      color: white;
      background: linear-gradient(135deg, #2f6f53, #c0512d);
    }

    mat-card-header {
      margin-bottom: 0.5rem;
      align-items: start;
    }

    mat-card-title {
      line-height: 1.1;
      word-break: break-word;
    }

    mat-card-subtitle {
      color: var(--app-muted);
      white-space: normal;
    }

    .chip-row {
      margin-bottom: 0.75rem;
    }

    .chip-row mat-chip-set {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .chip-row mat-chip {
      max-width: 100%;
    }

    .summary {
      margin: 0 0 1rem;
      color: var(--app-muted);
      line-height: 1.55;
      word-break: break-word;
    }

    mat-card-content {
      flex: 1;
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
      padding: 0 16px 16px;
      margin-top: 0.5rem;
    }

    @media (max-width: 420px) {
      .card-avatar {
        width: 40px;
        height: 40px;
      }

      mat-card-title {
        font-size: 1.85rem;
      }

      mat-card-subtitle {
        font-size: 0.95rem;
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
  @Input({ required: true }) scored!: ScoredRecipe;
  @Output() viewDetails = new EventEmitter<string>();
}
