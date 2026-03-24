import { Injectable } from '@angular/core';
import { Recipe } from '../models';

const RECIPES: Recipe[] = [
  {
    id: 'spinach-egg-scramble',
    title: 'Spinach Egg Scramble',
    ingredients: ['eggs', 'spinach', 'milk', 'onion', 'cheese'],
    minutes: 12,
    difficulty: 'Easy',
    tags: ['Breakfast', 'Quick', 'Vegetarian'],
    steps: [
      'Whisk eggs with a splash of milk.',
      'Cook onion until soft, then add spinach.',
      'Pour in eggs, stir gently, and finish with cheese.'
    ]
  },
  {
    id: 'creamy-tomato-pasta',
    title: 'Creamy Tomato Pasta',
    ingredients: ['pasta', 'tomato', 'onion', 'garlic', 'milk', 'cheese'],
    minutes: 22,
    difficulty: 'Easy',
    tags: ['Dinner', 'Comfort'],
    steps: [
      'Boil pasta until tender.',
      'Cook onion and garlic, then stir in tomato.',
      'Add milk and cheese for a quick sauce, then toss with pasta.'
    ]
  },
  {
    id: 'chicken-rice-bowl',
    title: 'Chicken Rice Bowl',
    ingredients: ['chicken', 'rice', 'onion', 'garlic', 'spinach'],
    minutes: 28,
    difficulty: 'Medium',
    tags: ['High Protein', 'Meal Prep'],
    steps: [
      'Cook rice according to package directions.',
      'Saute onion, garlic, and chicken until cooked through.',
      'Fold in spinach and serve over rice.'
    ]
  },
  {
    id: 'bean-cheese-quesadilla',
    title: 'Bean Cheese Quesadilla',
    ingredients: ['beans', 'tortillas', 'cheese', 'onion', 'tomato'],
    minutes: 14,
    difficulty: 'Easy',
    tags: ['Lunch', 'Vegetarian'],
    steps: [
      'Spread beans over tortillas and top with cheese, onion, and tomato.',
      'Fold and toast in a skillet until crisp.',
      'Slice and serve warm.'
    ]
  },
  {
    id: 'yogurt-fruit-parfait',
    title: 'Yogurt Fruit Parfait',
    ingredients: ['yogurt', 'milk', 'banana', 'berries'],
    minutes: 5,
    difficulty: 'Easy',
    tags: ['Breakfast', 'Snack'],
    steps: [
      'Layer yogurt, sliced fruit, and berries in a bowl.',
      'Add a splash of milk if you want it looser.',
      'Serve chilled.'
    ]
  },
  {
    id: 'chicken-spinach-wrap',
    title: 'Chicken Spinach Wrap',
    ingredients: ['chicken', 'spinach', 'tortillas', 'yogurt', 'tomato'],
    minutes: 16,
    difficulty: 'Easy',
    tags: ['Lunch', 'Quick'],
    steps: [
      'Warm tortillas briefly.',
      'Fill with cooked chicken, spinach, and tomato.',
      'Use yogurt as a tangy sauce and roll tightly.'
    ]
  },
  {
    id: 'garlic-fried-rice',
    title: 'Garlic Fried Rice',
    ingredients: ['rice', 'eggs', 'garlic', 'onion', 'spinach'],
    minutes: 18,
    difficulty: 'Easy',
    tags: ['Leftovers', 'One Pan'],
    steps: [
      'Cook onion and garlic until fragrant.',
      'Add rice and stir until hot.',
      'Push rice aside, scramble eggs, then toss with spinach.'
    ]
  },
  {
    id: 'tomato-bean-soup',
    title: 'Tomato Bean Soup',
    ingredients: ['beans', 'tomato', 'onion', 'garlic', 'spinach'],
    minutes: 25,
    difficulty: 'Easy',
    tags: ['Soup', 'Budget'],
    steps: [
      'Saute onion and garlic.',
      'Add tomato and beans with water or stock.',
      'Simmer, then stir in spinach before serving.'
    ]
  },
  {
    id: 'cheesy-breakfast-tacos',
    title: 'Cheesy Breakfast Tacos',
    ingredients: ['eggs', 'tortillas', 'cheese', 'tomato', 'spinach'],
    minutes: 15,
    difficulty: 'Easy',
    tags: ['Breakfast', 'Quick'],
    steps: [
      'Scramble eggs with chopped spinach.',
      'Warm tortillas and fill with eggs, cheese, and tomato.',
      'Serve immediately.'
    ]
  },
  {
    id: 'baked-chicken-pasta',
    title: 'Baked Chicken Pasta',
    ingredients: ['chicken', 'pasta', 'tomato', 'cheese', 'garlic'],
    minutes: 35,
    difficulty: 'Medium',
    tags: ['Dinner', 'Bake'],
    steps: [
      'Cook pasta and combine with cooked chicken and tomato.',
      'Season with garlic and top with cheese.',
      'Bake until bubbling.'
    ]
  },
  {
    id: 'spinach-yogurt-dip-plate',
    title: 'Spinach Yogurt Dip Plate',
    ingredients: ['spinach', 'yogurt', 'garlic', 'tortillas', 'cheese'],
    minutes: 10,
    difficulty: 'Easy',
    tags: ['Snack', 'Shareable'],
    steps: [
      'Stir yogurt with garlic and chopped spinach.',
      'Warm tortillas and cut into wedges.',
      'Serve the dip with cheese sprinkled on top.'
    ]
  },
  {
    id: 'milk-rice-pudding',
    title: 'Milk Rice Pudding',
    ingredients: ['milk', 'rice', 'yogurt', 'banana'],
    minutes: 20,
    difficulty: 'Easy',
    tags: ['Dessert', 'Breakfast'],
    steps: [
      'Simmer cooked rice with milk until creamy.',
      'Stir in yogurt for tang and top with banana.',
      'Serve warm or chilled.'
    ]
  }
];

const INGREDIENT_SUGGESTIONS = [
  'eggs',
  'milk',
  'chicken',
  'rice',
  'pasta',
  'tomato',
  'onion',
  'garlic',
  'spinach',
  'beans',
  'tortillas',
  'cheese',
  'yogurt',
  'banana',
  'berries'
];

@Injectable({ providedIn: 'root' })
export class RecipesService {
  getRecipes(): Recipe[] {
    return RECIPES;
  }

  getRecipeById(id: string): Recipe | undefined {
    return RECIPES.find((recipe) => recipe.id === id);
  }

  getIngredientSuggestions(): string[] {
    return INGREDIENT_SUGGESTIONS;
  }
}
