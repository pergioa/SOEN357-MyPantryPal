import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home.page';
import { PantryPageComponent } from './pages/pantry.page';
import { RecipeDetailPageComponent } from './pages/recipe-detail.page';
import { RecipesPageComponent } from './pages/recipes.page';
import { StudyLogPageComponent } from './pages/study-log.page';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'pantry', component: PantryPageComponent },
  { path: 'recipes', component: RecipesPageComponent },
  { path: 'recipes/:id', component: RecipeDetailPageComponent },
  { path: 'study-log', component: StudyLogPageComponent },
  { path: '**', redirectTo: '' }
];
