import { supabase } from './supabase';

// External API endpoints
export const API_ENDPOINTS = {
  WEATHER: '/api/weather',
  NEWS: '/api/news',
  CURRENCY: '/api/currency',
  TUTORIALS: '/api/tutorials',
  RECIPES: '/api/recipes',
  TIPS: '/api/tips',
  TIP_OF_DAY: '/api/tips/daily'
};

// ტიპები
export type Recipe = {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  category: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  createdAt: string;
  updatedAt: string;
};

export type Ingredient = {
  id: number;
  recipeId: number;
  name: string;
  amount: string;
  unit: string;
  createdAt: string;
};

export type Step = {
  id: number;
  recipeId: number;
  stepNumber: number;
  instruction: string;
  createdAt: string;
};

export type News = {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  videoUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Tutorial = {
  id: number;
  title: string;
  content: string;
  category: string;
  imageUrl: string | null;
  readTime: string;
  createdAt: string;
  updatedAt: string;
};

export type Tip = {
  id: number;
  title: string;
  content: string;
  category: string;
  isTipOfDay: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RecipeWithDetails = Recipe & {
  ingredients: Ingredient[];
  steps: Step[];
};

// რეცეპტების API ფუნქციები
export async function getAllRecipes(): Promise<RecipeWithDetails[]> {
  const { data: recipes, error: recipesError } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false });

  if (recipesError) {
    console.error('Error fetching recipes:', recipesError);
    return [];
  }

  // რეცეპტების დეტალების მიღება
  const recipesWithDetails = await Promise.all(
    recipes.map(async (recipe) => {
      // ინგრედიენტების მიღება
      const { data: ingredients, error: ingredientsError } = await supabase
        .from('ingredients')
        .select('*')
        .eq('recipe_id', recipe.id);

      if (ingredientsError) {
        console.error(`Error fetching ingredients for recipe ${recipe.id}:`, ingredientsError);
        return { ...recipe, ingredients: [], steps: [] };
      }

      // ნაბიჯების მიღება
      const { data: steps, error: stepsError } = await supabase
        .from('steps')
        .select('*')
        .eq('recipe_id', recipe.id)
        .order('step_number', { ascending: true });

      if (stepsError) {
        console.error(`Error fetching steps for recipe ${recipe.id}:`, stepsError);
        return { ...recipe, ingredients, steps: [] };
      }

      return {
        ...recipe,
        ingredients,
        steps
      };
    })
  );

  return recipesWithDetails;
}

export async function getRecipeById(id: number): Promise<RecipeWithDetails | null> {
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  if (recipeError) {
    console.error(`Error fetching recipe ${id}:`, recipeError);
    return null;
  }

  // ინგრედიენტების მიღება
  const { data: ingredients, error: ingredientsError } = await supabase
    .from('ingredients')
    .select('*')
    .eq('recipe_id', id);

  if (ingredientsError) {
    console.error(`Error fetching ingredients for recipe ${id}:`, ingredientsError);
    return { ...recipe, ingredients: [], steps: [] };
  }

  // ნაბიჯების მიღება
  const { data: steps, error: stepsError } = await supabase
    .from('steps')
    .select('*')
    .eq('recipe_id', id)
    .order('step_number', { ascending: true });

  if (stepsError) {
    console.error(`Error fetching steps for recipe ${id}:`, stepsError);
    return { ...recipe, ingredients, steps: [] };
  }

  return {
    ...recipe,
    ingredients,
    steps
  };
}

export async function createRecipe(recipeData: {
  recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>;
  ingredients: Omit<Ingredient, 'id' | 'recipeId' | 'createdAt'>[];
  steps: Omit<Step, 'id' | 'recipeId' | 'createdAt'>[];
}): Promise<RecipeWithDetails | null> {
  // ტრანზაქციის დაწყება
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .insert({
      title: recipeData.recipe.title,
      description: recipeData.recipe.description,
      image_url: recipeData.recipe.imageUrl,
      category: recipeData.recipe.category,
      prep_time: recipeData.recipe.prepTime,
      cook_time: recipeData.recipe.cookTime,
      servings: recipeData.recipe.servings,
      difficulty: recipeData.recipe.difficulty,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (recipeError) {
    console.error('Error creating recipe:', recipeError);
    return null;
  }

  // ინგრედიენტების დამატება
  const ingredientsWithRecipeId = recipeData.ingredients.map(ingredient => ({
    recipe_id: recipe.id,
    name: ingredient.name,
    amount: ingredient.amount,
    unit: ingredient.unit,
    created_at: new Date().toISOString()
  }));

  const { data: ingredients, error: ingredientsError } = await supabase
    .from('ingredients')
    .insert(ingredientsWithRecipeId)
    .select();

  if (ingredientsError) {
    console.error('Error creating ingredients:', ingredientsError);
    // რეცეპტი უკვე შექმნილია, ამიტომ ვაბრუნებთ ნაწილობრივ შევსებულ ობიექტს
    return { ...recipe, ingredients: [], steps: [] };
  }

  // ნაბიჯების დამატება
  const stepsWithRecipeId = recipeData.steps.map(step => ({
    recipe_id: recipe.id,
    step_number: step.stepNumber,
    instruction: step.instruction,
    created_at: new Date().toISOString()
  }));

  const { data: steps, error: stepsError } = await supabase
    .from('steps')
    .insert(stepsWithRecipeId)
    .select();

  if (stepsError) {
    console.error('Error creating steps:', stepsError);
    // რეცეპტი და ინგრედიენტები უკვე შექმნილია
    return { ...recipe, ingredients: ingredients || [], steps: [] };
  }

  return {
    ...recipe,
    ingredients: ingredients || [],
    steps: steps || []
  };
}

export async function updateRecipe(id: number, recipeData: {
  recipe: Partial<Recipe>;
  ingredients: Omit<Ingredient, 'id' | 'recipeId' | 'createdAt'>[];
  steps: Omit<Step, 'id' | 'recipeId' | 'createdAt'>[];
}): Promise<RecipeWithDetails | null> {
  // რეცეპტის განახლება
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .update({
      title: recipeData.recipe.title,
      description: recipeData.recipe.description,
      image_url: recipeData.recipe.imageUrl,
      category: recipeData.recipe.category,
      prep_time: recipeData.recipe.prepTime,
      cook_time: recipeData.recipe.cookTime,
      servings: recipeData.recipe.servings,
      difficulty: recipeData.recipe.difficulty,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (recipeError) {
    console.error(`Error updating recipe ${id}:`, recipeError);
    return null;
  }

  // ძველი ინგრედიენტების წაშლა
  const { error: deleteIngredientsError } = await supabase
    .from('ingredients')
    .delete()
    .eq('recipe_id', id);

  if (deleteIngredientsError) {
    console.error(`Error deleting ingredients for recipe ${id}:`, deleteIngredientsError);
    return { ...recipe, ingredients: [], steps: [] };
  }

  // ძველი ნაბიჯების წაშლა
  const { error: deleteStepsError } = await supabase
    .from('steps')
    .delete()
    .eq('recipe_id', id);

  if (deleteStepsError) {
    console.error(`Error deleting steps for recipe ${id}:`, deleteStepsError);
    return { ...recipe, ingredients: [], steps: [] };
  }

  // ახალი ინგრედიენტების დამატება
  const ingredientsWithRecipeId = recipeData.ingredients.map(ingredient => ({
    recipe_id: id,
    name: ingredient.name,
    amount: ingredient.amount,
    unit: ingredient.unit,
    created_at: new Date().toISOString()
  }));

  const { data: ingredients, error: ingredientsError } = await supabase
    .from('ingredients')
    .insert(ingredientsWithRecipeId)
    .select();

  if (ingredientsError) {
    console.error(`Error creating new ingredients for recipe ${id}:`, ingredientsError);
    return { ...recipe, ingredients: [], steps: [] };
  }

  // ახალი ნაბიჯების დამატება
  const stepsWithRecipeId = recipeData.steps.map(step => ({
    recipe_id: id,
    step_number: step.stepNumber,
    instruction: step.instruction,
    created_at: new Date().toISOString()
  }));

  const { data: steps, error: stepsError } = await supabase
    .from('steps')
    .insert(stepsWithRecipeId)
    .select();

  if (stepsError) {
    console.error(`Error creating new steps for recipe ${id}:`, stepsError);
    return { ...recipe, ingredients: ingredients || [], steps: [] };
  }

  return {
    ...recipe,
    ingredients: ingredients || [],
    steps: steps || []
  };
}

export async function deleteRecipe(id: number): Promise<boolean> {
  // ინგრედიენტების წაშლა
  const { error: deleteIngredientsError } = await supabase
    .from('ingredients')
    .delete()
    .eq('recipe_id', id);

  if (deleteIngredientsError) {
    console.error(`Error deleting ingredients for recipe ${id}:`, deleteIngredientsError);
    return false;
  }

  // ნაბიჯების წაშლა
  const { error: deleteStepsError } = await supabase
    .from('steps')
    .delete()
    .eq('recipe_id', id);

  if (deleteStepsError) {
    console.error(`Error deleting steps for recipe ${id}:`, deleteStepsError);
    return false;
  }

  // რეცეპტის წაშლა
  const { error: deleteRecipeError } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id);

  if (deleteRecipeError) {
    console.error(`Error deleting recipe ${id}:`, deleteRecipeError);
    return false;
  }

  return true;
}

// Currency list
export const CURRENCIES = [
  { value: "USD", label: "US Dollar" },
  { value: "EUR", label: "Euro" },
  { value: "GBP", label: "British Pound" },
  { value: "JPY", label: "Japanese Yen" },
  { value: "GEL", label: "Georgian Lari" },
  { value: "AUD", label: "Australian Dollar" },
  { value: "CAD", label: "Canadian Dollar" },
  { value: "CHF", label: "Swiss Franc" },
  { value: "CNY", label: "Chinese Yuan" },
  { value: "INR", label: "Indian Rupee" },
  { value: "RUB", label: "Russian Ruble" },
  { value: "TRY", label: "Turkish Lira" },
];

// News categories
export const NEWS_CATEGORIES = [
  "Business",
  "Entertainment",
  "General",
  "Health",
  "Science",
  "Sports",
  "Technology"
];

// Tutorial categories
export const TUTORIAL_CATEGORIES = [
  "Finance",
  "Personal Development",
  "Technology",
  "Health",
  "Cooking",
  "Home Improvement",
  "Education"
];

// Recipe cuisines
export const RECIPE_CUISINES = [
  "American",
  "British",
  "Canadian",
  "Chinese", 
  "Croatian",
  "Dutch",
  "Egyptian",
  "Filipino",
  "French",
  "Georgian", // ქართული სამზარეულო
  "Greek",
  "Indian",
  "Irish",
  "Italian",
  "Jamaican",
  "Japanese",
  "Kenyan",
  "Malaysian",
  "Mexican",
  "Moroccan",
  "Polish",
  "Portuguese",
  "Russian",
  "Spanish",
  "Thai",
  "Tunisian",
  "Turkish",
  "Vietnamese"
];

// სიახლეების API ფუნქციები
export async function getAllNews(): Promise<News[]> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching news:', error);
    return [];
  }

  return data;
}

export async function getNewsById(id: number): Promise<News | null> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching news ${id}:`, error);
    return null;
  }

  return data;
}

export async function createNews(newsData: {
  title: string;
  content: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
}): Promise<News | null> {
  const { data, error } = await supabase
    .from('news')
    .insert({
      title: newsData.title,
      content: newsData.content,
      image_url: newsData.imageUrl,
      video_url: newsData.videoUrl,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating news:', error);
    return null;
  }

  return data;
}

export async function updateNews(id: number, newsData: {
  title?: string;
  content?: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
}): Promise<News | null> {
  const { data, error } = await supabase
    .from('news')
    .update({
      title: newsData.title,
      content: newsData.content,
      image_url: newsData.imageUrl,
      video_url: newsData.videoUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating news ${id}:`, error);
    return null;
  }

  return data;
}

export async function deleteNews(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting news ${id}:`, error);
    return false;
  }

  return true;
}

// ტუტორიალების API ფუნქციები
export async function getAllTutorials(): Promise<Tutorial[]> {
  const { data, error } = await supabase
    .from('tutorials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tutorials:', error);
    return [];
  }

  return data;
}

export async function searchTutorials(query: string): Promise<Tutorial[]> {
  const { data, error } = await supabase
    .from('tutorials')
    .select('*')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%,category.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error searching tutorials with query "${query}":`, error);
    return [];
  }

  return data;
}

export async function getTutorialById(id: number): Promise<Tutorial | null> {
  const { data, error } = await supabase
    .from('tutorials')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching tutorial ${id}:`, error);
    return null;
  }

  return data;
}

export async function createTutorial(tutorialData: {
  title: string;
  content: string;
  category: string;
  imageUrl?: string | null;
  readTime: string;
}): Promise<Tutorial | null> {
  const { data, error } = await supabase
    .from('tutorials')
    .insert({
      title: tutorialData.title,
      content: tutorialData.content,
      category: tutorialData.category,
      image_url: tutorialData.imageUrl,
      read_time: tutorialData.readTime,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating tutorial:', error);
    return null;
  }

  return data;
}

export async function updateTutorial(id: number, tutorialData: {
  title?: string;
  content?: string;
  category?: string;
  imageUrl?: string | null;
  readTime?: string;
}): Promise<Tutorial | null> {
  const { data, error } = await supabase
    .from('tutorials')
    .update({
      title: tutorialData.title,
      content: tutorialData.content,
      category: tutorialData.category,
      image_url: tutorialData.imageUrl,
      read_time: tutorialData.readTime,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating tutorial ${id}:`, error);
    return null;
  }

  return data;
}

export async function deleteTutorial(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('tutorials')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting tutorial ${id}:`, error);
    return false;
  }

  return true;
}

// რჩევების API ფუნქციები
export async function getAllTips(): Promise<Tip[]> {
  const { data, error } = await supabase
    .from('tips')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tips:', error);
    return [];
  }

  return data;
}

export async function getTipById(id: number): Promise<Tip | null> {
  const { data, error } = await supabase
    .from('tips')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching tip ${id}:`, error);
    return null;
  }

  return data;
}

export async function getTipOfDay(): Promise<Tip | null> {
  const { data, error } = await supabase
    .from('tips')
    .select('*')
    .eq('is_tip_of_day', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching tip of the day:', error);
    return null;
  }

  return data;
}

export async function createTip(tipData: {
  title: string;
  content: string;
  category: string;
  isTipOfDay?: boolean;
}): Promise<Tip | null> {
  const { data, error } = await supabase
    .from('tips')
    .insert({
      title: tipData.title,
      content: tipData.content,
      category: tipData.category,
      is_tip_of_day: tipData.isTipOfDay || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating tip:', error);
    return null;
  }

  return data;
}

export async function updateTip(id: number, tipData: {
  title?: string;
  content?: string;
  category?: string;
  isTipOfDay?: boolean;
}): Promise<Tip | null> {
  const { data, error } = await supabase
    .from('tips')
    .update({
      title: tipData.title,
      content: tipData.content,
      category: tipData.category,
      is_tip_of_day: tipData.isTipOfDay,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating tip ${id}:`, error);
    return null;
  }

  return data;
}

export async function deleteTip(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('tips')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting tip ${id}:`, error);
    return false;
  }

  return true;
}

// MealDB API ტიპები
export interface MealDBResponse {
  meals: Meal[] | null;
  error?: boolean;
  message?: string;
}

export interface MealDBCategoriesResponse {
  categories: MealCategory[] | null;
  error?: boolean;
  message?: string;
}

export interface MealCategory {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface Meal {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate: string | null;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string | null;
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strIngredient6?: string;
  strIngredient7?: string;
  strIngredient8?: string;
  strIngredient9?: string;
  strIngredient10?: string;
  strIngredient11?: string;
  strIngredient12?: string;
  strIngredient13?: string;
  strIngredient14?: string;
  strIngredient15?: string;
  strIngredient16?: string;
  strIngredient17?: string;
  strIngredient18?: string;
  strIngredient19?: string;
  strIngredient20?: string;
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
  strMeasure6?: string;
  strMeasure7?: string;
  strMeasure8?: string;
  strMeasure9?: string;
  strMeasure10?: string;
  strMeasure11?: string;
  strMeasure12?: string;
  strMeasure13?: string;
  strMeasure14?: string;
  strMeasure15?: string;
  strMeasure16?: string;
  strMeasure17?: string;
  strMeasure18?: string;
  strMeasure19?: string;
  strMeasure20?: string;
}
