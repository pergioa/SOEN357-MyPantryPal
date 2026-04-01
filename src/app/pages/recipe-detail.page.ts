import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { PantryService } from '../core/services/pantry.service';
import { RecipesService } from '../core/services/recipes.service';
import { StudyLogService } from '../core/services/study-log.service';
import { StudyModeService } from '../core/services/study-mode.service';
import { normalizeName, scoreRecipes } from '../core/utils/scoring-utils';
import { FreshnessTone, daysLeft, freshnessTone } from '../core/utils/date-utils';

@Component({
  selector: 'app-recipe-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TitleCasePipe,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule
  ],
  template: `
    <section class="shell detail-shell" *ngIf="scoredRecipe(); else missingRecipe">
      <a class="back-link" routerLink="/recipes">← Back to recipes</a>

      <mat-card class="hero-card">
        <div class="hero-copy">
          <p class="eyebrow">Recipe detail</p>
          <h1>{{ scoredRecipe()!.recipe.title }}</h1>
          <p class="meta">
            {{ scoredRecipe()!.recipe.minutes }} minutes · {{ scoredRecipe()!.recipe.difficulty }}
          </p>
          <mat-chip-set>
            <mat-chip *ngFor="let tag of scoredRecipe()!.recipe.tags">{{ tag }}</mat-chip>
            <mat-chip *ngIf="mode() === 'B' && scoredRecipe()!.soonIngredients.length" class="use-soon-chip">
              <mat-icon>warning</mat-icon>
              Use Soon
            </mat-chip>
          </mat-chip-set>
        </div>
        <button mat-flat-button color="primary" (click)="submitChoice()">Submit Choice</button>
      </mat-card>

      <div class="detail-grid">
        <mat-card class="detail-card">
          <h2>Ingredient checklist</h2>
          <div class="ingredient-list">
            <label class="ingredient-row" *ngFor="let ingredient of scoredRecipe()!.recipe.ingredients">
              <mat-checkbox [checked]="scoredRecipe()!.presentIngredients.includes(ingredient)">
                <span
                  [class.soon-ingredient-danger]="ingredientTone(ingredient) === 'danger'"
                  [class.soon-ingredient-warn]="ingredientTone(ingredient) === 'warn'"
                >
                  {{ ingredient | titlecase }}
                </span>
              </mat-checkbox>
            </label>
          </div>
        </mat-card>

        <mat-card class="detail-card">
          <h2>Steps</h2>
          <ol>
            <li *ngFor="let step of scoredRecipe()!.recipe.steps">{{ step }}</li>
          </ol>
        </mat-card>
      </div>
    </section>

    <ng-template #missingRecipe>
      <section class="shell detail-shell">
        <mat-card class="detail-card">
          <h1>Recipe not found</h1>
          <p>The selected recipe could not be loaded.</p>
          <a mat-stroked-button routerLink="/recipes">Back to recipes</a>
        </mat-card>
      </section>
    </ng-template>
  `,
  styles: [`
    .detail-shell {
      display: grid;
      gap: 1rem;
      padding-top: 1rem;
    }

    .back-link {
      color: var(--app-accent);
      text-decoration: none;
      font-weight: 700;
    }

    .hero-card,
    .detail-card {
      padding: 1.25rem;
      border-radius: 26px;
    }

    .hero-card {
      display: grid;
      gap: 1rem;
      background:
        radial-gradient(circle at top right, rgba(217, 152, 45, 0.18), transparent 30%),
        linear-gradient(135deg, rgba(252, 249, 242, 0.92), rgba(255, 239, 219, 0.8));
    }

    .hero-copy h1,
    .detail-card h2 {
      margin-top: 0;
    }

    .eyebrow {
      margin: 0 0 0.35rem;
      color: var(--app-accent);
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .meta {
      color: var(--app-muted);
    }

    .detail-grid {
      display: grid;
      gap: 1rem;
      padding-bottom: 1rem;
    }

    .ingredient-list {
      display: grid;
      gap: 0.5rem;
    }

    .ingredient-row {
      display: block;
      padding: 0.75rem 0;
      border-bottom: 1px solid rgba(17, 38, 53, 0.08);
    }

    .ingredient-row:last-child {
      border-bottom: 0;
    }

    .use-soon-chip,
    .soon-ingredient-danger {
      color: #9a3412;
      font-weight: 700;
    }

    .soon-ingredient-warn {
      color: #9a7a00;
      font-weight: 700;
    }

    ol {
      margin: 0;
      padding-left: 1.2rem;
      line-height: 1.7;
    }

    @media (min-width: 900px) {
      .hero-card {
        grid-template-columns: 1fr auto;
        align-items: center;
      }

      .detail-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pantryService = inject(PantryService);
  private readonly recipesService = inject(RecipesService);
  private readonly studyMode = inject(StudyModeService);
  private readonly studyLog = inject(StudyLogService);

  private readonly routeParams = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });

  readonly recipeId = computed(() => this.routeParams()?.get('id') ?? '');
  readonly mode = computed(() => this.studyMode.mode());
  readonly scoredRecipe = computed(() =>
    scoreRecipes(this.recipesService.getRecipes(), this.pantryService.pantry(), this.mode())
      .find((entry) => entry.recipe.id === this.recipeId())
  );

  ingredientTone(ingredient: string): FreshnessTone | null {
    if (this.mode() !== 'B') {
      return null;
    }

    const pantryItem = this.pantryService.pantry().find((item) => item.name === normalizeName(ingredient));
    if (!pantryItem) {
      return null;
    }

    const tone = freshnessTone(daysLeft(pantryItem.expiresOn));
    return tone === 'ok' ? null : tone;
  }

  submitChoice(): void {
    const scored = this.scoredRecipe();
    if (!scored) {
      return;
    }

    this.studyLog.add({
      chosenRecipeId: scored.recipe.id,
      mode: this.mode(),
      timestamp: new Date().toISOString(),
      pantrySnapshot: this.pantryService.pantry()
    });

    this.router.navigate(['/study-log']);
  }
}
