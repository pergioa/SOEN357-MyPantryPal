import { IngredientItem, Recipe, ScoredRecipe } from '../models';

export function normalizeName(value: string): string {
  return value.trim().toLowerCase();
}

export function scoreRecipes(
  recipes: Recipe[],
  pantry: IngredientItem[]
): ScoredRecipe[] {
  const pantryMap = new Map(pantry.map((item) => [normalizeName(item.name), item]));

  return recipes
    .map((recipe) => {
      const presentIngredients = recipe.ingredients.filter((ingredient) => pantryMap.has(ingredient));
      const missingIngredients = recipe.ingredients.filter((ingredient) => !pantryMap.has(ingredient));

      return {
        recipe,
        matchScore: presentIngredients.length,
        presentIngredients,
        missingIngredients
      };
    })
    .sort((left, right) => {
      if (right.matchScore !== left.matchScore) {
        return right.matchScore - left.matchScore;
      }

      return left.recipe.minutes - right.recipe.minutes;
    });
}
