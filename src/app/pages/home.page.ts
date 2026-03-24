import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ModeToggleComponent } from '../shared/components/mode-toggle.component';
import { StudyModeService } from '../core/services/study-mode.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, ModeToggleComponent],
  template: `
    <section class="hero shell">
      <div class="hero-copy">
        <p class="eyebrow">Food waste reduction study</p>
        <h1>Cook what you already have before it expires.</h1>
        <p class="lede">
          MyPantryPal helps participants log pantry items, compare recipes, and test whether
          expiration-aware recommendations shift recipe choice.
        </p>
        <div class="cta-row">
          <a mat-flat-button color="primary" routerLink="/pantry">Add Pantry Items</a>
          <a mat-stroked-button routerLink="/recipes">Find Recipes</a>
        </div>
        <div class="hero-stats" aria-label="Study features">
          <div>
            <strong>12</strong>
            <span>hardcoded recipes</span>
          </div>
          <div>
            <strong>A/B</strong>
            <span>study conditions</span>
          </div>
          <div>
            <strong>Local</strong>
            <span>device-only storage</span>
          </div>
        </div>
      </div>

      <mat-card class="mode-card">
        <p class="mode-title">Current Study Mode</p>
        <h2>{{ modeName() }}</h2>
        <p>
          Mode {{ mode() }} is currently active.
          <span *ngIf="mode() === 'A'">Recipes are sorted by ingredient match only.</span>
          <span *ngIf="mode() === 'B'">Recipes that use soon-to-expire items get a priority boost.</span>
        </p>
        <app-mode-toggle></app-mode-toggle>
      </mat-card>
    </section>

    <section class="shell highlights">
      <mat-card>
        <h3>My Pantry</h3>
        <p>Manually add ingredients, quantities, and expiration dates with quick date shortcuts.</p>
      </mat-card>
      <mat-card>
        <h3>Recipes</h3>
        <p>Compare recipes by pantry match, missing ingredients, time, and expiration relevance.</p>
      </mat-card>
      <mat-card>
        <h3>Study Modes</h3>
        <p>Switch between standard ranking and expiration-aware ranking to compare recommendation behavior.</p>
      </mat-card>
    </section>
  `,
  styles: [`
    .hero {
      display: grid;
      gap: 1rem;
      padding-top: 1.5rem;
    }

    .hero-copy {
      position: relative;
      overflow: hidden;
      padding: 1.5rem;
      border-radius: 30px;
      background:
        radial-gradient(circle at top right, rgba(217, 152, 45, 0.16), transparent 24%),
        linear-gradient(180deg, rgba(252, 249, 242, 0.96), rgba(252, 249, 242, 0.88));
      box-shadow: 0 24px 60px rgba(17, 38, 53, 0.1);
    }

    .hero-copy::after {
      content: '';
      position: absolute;
      right: -36px;
      bottom: -36px;
      width: 170px;
      height: 170px;
      border-radius: 999px;
      background: radial-gradient(circle, rgba(47, 111, 83, 0.16), transparent 70%);
      pointer-events: none;
    }

    .mode-card {
      padding: 1.5rem;
      border-radius: 30px;
      background:
        linear-gradient(180deg, rgba(255, 249, 241, 0.95), rgba(252, 249, 242, 0.9));
      box-shadow: 0 24px 60px rgba(17, 38, 53, 0.08);
    }

    .eyebrow {
      margin: 0 0 0.5rem;
      color: var(--app-accent);
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-size: 0.75rem;
    }

    h1 {
      margin: 0;
      font-size: clamp(2.25rem, 7vw, 4.75rem);
      line-height: 0.97;
    }

    .lede {
      max-width: 55ch;
      color: var(--app-muted);
      font-size: 1rem;
      line-height: 1.7;
    }

    .cta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    .hero-stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    .hero-stats div {
      display: grid;
      gap: 0.2rem;
      padding: 0.85rem 0.9rem;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.48);
      border: 1px solid rgba(17, 38, 53, 0.06);
    }

    .hero-stats strong {
      font-family: var(--display-font);
      font-size: 1.35rem;
      line-height: 1;
    }

    .hero-stats span {
      color: var(--app-muted);
      font-size: 0.8rem;
      font-weight: 700;
    }

    .highlights {
      display: grid;
      gap: 1rem;
      margin-top: 1.25rem;
      padding-bottom: 1rem;
    }

    .highlights mat-card {
      position: relative;
      overflow: hidden;
      padding: 1.35rem;
      border-radius: 26px;
      background: rgba(252, 249, 242, 0.88);
    }

    .highlights mat-card::before {
      content: '';
      position: absolute;
      inset: 0 auto 0 0;
      width: 5px;
      background: linear-gradient(180deg, var(--app-green), var(--app-accent));
    }

    .mode-title {
      margin-bottom: 0.35rem;
      color: var(--app-muted);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.75rem;
    }

    h2,
    h3 {
      margin-top: 0;
    }

    h3 {
      margin-bottom: 0.5rem;
    }

    @media (min-width: 900px) {
      .hero {
        grid-template-columns: 1.4fr 1fr;
        align-items: stretch;
      }

      .highlights {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  private readonly studyMode = inject(StudyModeService);

  readonly mode = computed(() => this.studyMode.mode());
  readonly modeName = computed(() => this.mode() === 'A' ? 'Standard' : 'Expiration-aware');
}
