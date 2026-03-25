import { IngredientItem, Recipe, ScoredRecipe, StudyMode } from '../models';
import { isSoonToExpire } from './date-utils';

export function normalizeName(value: string): string {
  return value.trim().toLowerCase();
}

export function scoreRecipes(
  recipes: Recipe[],
  pantry: IngredientItem[],
  mode: StudyMode
): ScoredRecipe[] {
  const pantryMap = new Map(pantry.map((item) => [normalizeName(item.name), item]));

  return recipes
    .map((recipe) => {
      const presentIngredients = recipe.ingredients.filter((ingredient) => pantryMap.has(ingredient));
      const missingIngredients = recipe.ingredients.filter((ingredient) => !pantryMap.has(ingredient));
      const soonIngredients = recipe.ingredients.filter((ingredient) => {
        const pantryItem = pantryMap.get(ingredient);
        return pantryItem ? isSoonToExpire(pantryItem.expiresOn) : false;
      });
      const matchScore = presentIngredients.length;
      const boostScore = mode === 'B' ? soonIngredients.length * 2 : 0;

      return {
        recipe,
        matchScore,
        boostScore,
        totalScore: matchScore + boostScore,
        presentIngredients,
        missingIngredients,
        soonIngredients
      };
    })
    .sort((left, right) => {
      const leftScore = mode === 'B' ? left.totalScore : left.matchScore;
      const rightScore = mode === 'B' ? right.totalScore : right.matchScore;

      if (rightScore !== leftScore) {
        return rightScore - leftScore;
      }

      return left.recipe.minutes - right.recipe.minutes;
    });
}
