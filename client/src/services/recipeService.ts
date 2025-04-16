import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

// ტიპები Supabase-ის ცხრილებისთვის
type Recipe = Database['public']['Tables']['recipes']['Insert'];
type Ingredient = Database['public']['Tables']['ingredients']['Insert'];
type Step = Database['public']['Tables']['steps']['Insert'];

/**
 * რეცეპტების სერვისი
 */
export const recipeService = {
  // ყველა რეცეპტის მიღება
  getAll: async () => {
    try {
      const { data, error } = await supabase.from('recipes').select('*');
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw new Error(`Failed to fetch recipes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // რეცეპტის მიღება ID-ით
  getById: async (id: number) => {
    try {
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();
      if (recipeError) throw recipeError;
      
      // ინგრედიენტების მიღება
      const { data: ingredients, error: ingredientsError } = await supabase
        .from('ingredients')
        .select('*')
        .eq('recipe_id', id);
      if (ingredientsError) throw ingredientsError;
      
      // ნაბიჯების მიღება
      const { data: steps, error: stepsError } = await supabase
        .from('steps')
        .select('*')
        .eq('recipe_id', id)
        .order('step_number', { ascending: true });
      if (stepsError) throw stepsError;
      
      return {
        ...recipe,
        ingredients: ingredients || [],
        steps: steps || []
      };
    } catch (error) {
      console.error('Error fetching recipe:', error);
      throw new Error(`Failed to fetch recipe: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // ახალი რეცეპტის შექმნა
  create: async (recipeData: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Creating recipe with data:', recipeData);
      
      // რეცეპტის შენახვა
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          ...recipeData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (recipeError) {
        console.error('Error creating recipe:', recipeError);
        throw recipeError;
      }
      
      console.log('Recipe created successfully:', recipe);
      return recipe;
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw new Error(`Failed to create recipe: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // რეცეპტის განახლება
  update: async (id: number, recipeData: Partial<Omit<Recipe, 'id' | 'created_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .update({
          ...recipeData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error updating recipe:', error);
      throw new Error(`Failed to update recipe: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // ინგრედიენტების დამატება რეცეპტისთვის
  addIngredients: async (recipeId: number, ingredients: Array<Omit<Ingredient, 'id' | 'recipe_id' | 'created_at'>>) => {
    try {
      console.log('Adding ingredients for recipe ID:', recipeId, ingredients);
      
      if (!ingredients || ingredients.length === 0) {
        console.log('No ingredients to add');
        return [];
      }
      
      const { data, error } = await supabase
        .from('ingredients')
        .insert(
          ingredients.map(ingredient => ({
            ...ingredient,
            recipe_id: recipeId,
            created_at: new Date().toISOString()
          }))
        )
        .select();
      
      if (error) {
        console.error('Error adding ingredients:', error);
        throw error;
      }
      
      console.log('Ingredients added successfully:', data);
      return data;
    } catch (error) {
      console.error('Error adding ingredients:', error);
      throw new Error(`Failed to add ingredients: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // ნაბიჯების დამატება რეცეპტისთვის
  addSteps: async (recipeId: number, steps: Array<Omit<Step, 'id' | 'recipe_id' | 'created_at'>>) => {
    try {
      console.log('Adding steps for recipe ID:', recipeId, steps);
      
      if (!steps || steps.length === 0) {
        console.log('No steps to add');
        return [];
      }
      
      const { data, error } = await supabase
        .from('steps')
        .insert(
          steps.map(step => ({
            ...step,
            recipe_id: recipeId,
            created_at: new Date().toISOString()
          }))
        )
        .select();
      
      if (error) {
        console.error('Error adding steps:', error);
        throw error;
      }
      
      console.log('Steps added successfully:', data);
      return data;
    } catch (error) {
      console.error('Error adding steps:', error);
      throw new Error(`Failed to add steps: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // რეცეპტის წაშლა
  delete: async (id: number) => {
    try {
      // ჯერ წავშალოთ ინგრედიენტები და ნაბიჯები
      const { error: ingredientsError } = await supabase
        .from('ingredients')
        .delete()
        .eq('recipe_id', id);
      if (ingredientsError) throw ingredientsError;
      
      const { error: stepsError } = await supabase
        .from('steps')
        .delete()
        .eq('recipe_id', id);
      if (stepsError) throw stepsError;
      
      // შემდეგ წავშალოთ რეცეპტი
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw new Error(`Failed to delete recipe: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // რეცეპტის შექმნა ინგრედიენტებითა და ნაბიჯებით
  createWithDetails: async (
    recipeData: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>,
    ingredients: Array<Omit<Ingredient, 'id' | 'recipe_id' | 'created_at'>>,
    steps: Array<Omit<Step, 'id' | 'recipe_id' | 'created_at'>>
  ) => {
    try {
      console.log('Creating recipe with details:', { recipeData, ingredients, steps });
      
      // 1. შევქმნათ რეცეპტი
      const recipe = await recipeService.create(recipeData);
      
      // 2. დავამატოთ ინგრედიენტები
      await recipeService.addIngredients(recipe.id, ingredients);
      
      // 3. დავამატოთ ნაბიჯები
      await recipeService.addSteps(recipe.id, steps);
      
      // 4. დავაბრუნოთ სრული რეცეპტი
      return await recipeService.getById(recipe.id);
    } catch (error) {
      console.error('Error creating recipe with details:', error);
      throw new Error(`Failed to create recipe with details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // რეცეპტის განახლება ინგრედიენტებითა და ნაბიჯებით
  updateWithDetails: async (
    id: number,
    recipeData: Partial<Omit<Recipe, 'id' | 'created_at'>>,
    ingredients: Array<Omit<Ingredient, 'id' | 'recipe_id' | 'created_at'>>,
    steps: Array<Omit<Step, 'id' | 'recipe_id' | 'created_at'>>
  ) => {
    try {
      console.log('Updating recipe with details:', { id, recipeData, ingredients, steps });
      
      // 1. განვაახლოთ რეცეპტი
      await recipeService.update(id, recipeData);
      
      // 2. წავშალოთ არსებული ინგრედიენტები და ნაბიჯები
      const { error: ingredientsError } = await supabase
        .from('ingredients')
        .delete()
        .eq('recipe_id', id);
      if (ingredientsError) throw ingredientsError;
      
      const { error: stepsError } = await supabase
        .from('steps')
        .delete()
        .eq('recipe_id', id);
      if (stepsError) throw stepsError;
      
      // 3. დავამატოთ ახალი ინგრედიენტები
      await recipeService.addIngredients(id, ingredients);
      
      // 4. დავამატოთ ახალი ნაბიჯები
      await recipeService.addSteps(id, steps);
      
      // 5. დავაბრუნოთ განახლებული რეცეპტი
      return await recipeService.getById(id);
    } catch (error) {
      console.error('Error updating recipe with details:', error);
      throw new Error(`Failed to update recipe with details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};