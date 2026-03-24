import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { PantryService } from '../core/services/pantry.service';
import { RecipesService } from '../core/services/recipes.service';
import { StudyModeService } from '../core/services/study-mode.service';
import { scoreRecipes } from '../core/utils/scoring-utils';
import { RecipeCardComponent } from '../shared/components/recipe-card.component';

@Component({
  selector: 'app-recipes-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, RecipeCardComponent],
  template: `
    <section class="shell page-shell">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Recipes</p>
          <h1>Task: Choose a recipe you would cook today.</h1>
          <p class="subtle">
            Recommendations update automatically from your pantry and current study mode.
          </p>
        </div>
        <mat-card class="task-banner">
          <strong>Mode {{ mode() }}</strong>
          <span *ngIf="mode() === 'A'">Sorted by pantry match, then time.</span>
          <span *ngIf="mode() === 'B'">Soon-to-expire ingredients receive a recommendation boost.</span>
        </mat-card>
      </div>

      <div *ngIf="!pantryItems().length" class="empty-message">
        Add pantry items first to see personalized recipe recommendations.
      </div>

      <div class="recipe-grid">
        <app-recipe-card
          *ngFor="let scored of scoredRecipes()"
          [scored]="scored"
          [mode]="mode()"
          (viewDetails)="router.navigate(['/recipes', $event])"
        ></app-recipe-card>
      </div>
    </section>
  `,
  styles: [`
    .page-shell {
      display: grid;
      gap: 1rem;
      padding-top: 1rem;
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

    h1 {
      margin: 0;
    }

    .subtle,
    .empty-message {
      color: var(--app-muted);
    }

    .task-banner {
      padding: 1rem 1.25rem;
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      background:
        radial-gradient(circle at top right, rgba(217, 152, 45, 0.2), transparent 36%),
        linear-gradient(135deg, rgba(217, 152, 45, 0.16), rgba(47, 111, 83, 0.12));
    }

    .recipe-grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: 1fr;
      padding-bottom: 1rem;
    }

    .empty-message {
      padding: 1rem 1.1rem;
      border-radius: 20px;
      background: rgba(252, 249, 242, 0.85);
      border: 1px dashed rgba(17, 38, 53, 0.16);
    }

    @media (min-width: 720px) {
      .recipe-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (min-width: 1180px) {
      .recipe-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .section-heading {
        grid-template-columns: 1.6fr minmax(280px, 360px);
        align-items: start;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipesPageComponent {
  readonly router = inject(Router);
  private readonly pantryService = inject(PantryService);
  private readonly recipesService = inject(RecipesService);
  private readonly studyMode = inject(StudyModeService);

  readonly pantryItems = this.pantryService.pantry;
  readonly mode = computed(() => this.studyMode.mode());
  readonly scoredRecipes = computed(() =>
    scoreRecipes(this.recipesService.getRecipes(), this.pantryService.pantry(), this.mode())
  );
}
