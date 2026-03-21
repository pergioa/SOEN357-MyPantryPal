import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home.page';
import { PantryPageComponent } from './pages/pantry.page';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'pantry', component: PantryPageComponent },
  { path: '**', redirectTo: '' }
];
