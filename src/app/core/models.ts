export interface IngredientItem {
  id: string;
  name: string;
  quantity?: string;
  expiresOn: string;
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  minutes: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  steps: string[];
}

export interface ScoredRecipe {
  recipe: Recipe;
  matchScore: number;
  presentIngredients: string[];
  missingIngredients: string[];
}
