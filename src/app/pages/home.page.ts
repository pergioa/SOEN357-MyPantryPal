import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatCardModule],
  template: `
    <section class="hero shell">
      <div class="hero-copy">
        <p class="eyebrow">Pantry and recipes</p>
        <h1>Match your pantry to simple recipe ideas.</h1>
        <p class="lede">
          This stage adds recipe browsing and pantry-based ranking so users can move from
          tracking ingredients to choosing a realistic meal.
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
            <strong>Match</strong>
            <span>ingredient ranking</span>
          </div>
          <div>
            <strong>Local</strong>
            <span>device-only storage</span>
          </div>
        </div>
      </div>
    </section>

    <section class="shell highlights">
      <mat-card>
        <h3>My Pantry</h3>
        <p>Manually add ingredients, quantities, and expiration dates with quick date shortcuts.</p>
      </mat-card>
      <mat-card>
        <h3>Recipes</h3>
        <p>Compare recipes by pantry match, missing ingredients, time, and difficulty.</p>
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

    h2,
    h3 {
      margin-top: 0;
    }

    h3 {
      margin-bottom: 0.5rem;
    }

    @media (min-width: 900px) {
      .hero {
        grid-template-columns: 1fr;
        align-items: stretch;
      }

      .highlights {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {}
