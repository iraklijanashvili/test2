import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

// ტიპები Supabase-ის ცხრილებისთვის
type Recipe = Database['public']['Tables']['recipes']['Insert'];
type Tip = Database['public']['Tables']['tips']['Insert'];
type Tutorial = Database['public']['Tables']['tutorials']['Insert'];
type News = Database['public']['Tables']['news']['Insert'];

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
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      
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
        ...data,
        ingredients: ingredients || [],
        steps: steps || []
      };
    } catch (error) {
      console.error('Error fetching recipe:', error);
      throw new Error(`Failed to fetch recipe: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // ახალი რეცეპტის შექმნა
  create: async (recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // რეცეპტის შენახვა
      const { data, error } = await supabase
        .from('recipes')
        .insert({
          ...recipe,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw new Error(`Failed to create recipe: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // რეცეპტის განახლება
  update: async (id: number, recipe: Partial<Omit<Recipe, 'id' | 'created_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .update({
          ...recipe,
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
  }
};

/**
 * რჩევების სერვისი
 */
export const tipService = {
  // ყველა რჩევის მიღება
  getAll: async () => {
    const { data, error } = await supabase.from('tips').select('*');
    if (error) throw error;
    return data;
  },

  // რჩევის მიღება ID-ით
  getById: async (id: number) => {
    const { data, error } = await supabase
      .from('tips')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  // დღის რჩევის მიღება
  getTipOfDay: async () => {
    const { data, error } = await supabase
      .from('tips')
      .select('*')
      .eq('is_tip_of_day', true)
      .single();
    if (error) throw error;
    return data;
  },

  // ახალი რჩევის შექმნა
  create: async (tip: Omit<Tip, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('tips')
      .insert({
        ...tip,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // რჩევის განახლება
  update: async (id: number, tip: Partial<Omit<Tip, 'id' | 'created_at'>>) => {
    const { data, error } = await supabase
      .from('tips')
      .update({
        ...tip,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // რჩევის წაშლა
  delete: async (id: number) => {
    const { error } = await supabase.from('tips').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};

/**
 * ინსტრუქციების სერვისი
 */
export const tutorialService = {
  // ყველა ინსტრუქციის მიღება
  getAll: async () => {
    const { data, error } = await supabase.from('tutorials').select('*');
    if (error) throw error;
    return data;
  },

  // ინსტრუქციის მიღება ID-ით
  getById: async (id: number) => {
    const { data, error } = await supabase
      .from('tutorials')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  // ახალი ინსტრუქციის შექმნა
  create: async (tutorial: Omit<Tutorial, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('tutorials')
      .insert({
        ...tutorial,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // ინსტრუქციის განახლება
  update: async (id: number, tutorial: Partial<Omit<Tutorial, 'id' | 'created_at'>>) => {
    const { data, error } = await supabase
      .from('tutorials')
      .update({
        ...tutorial,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // ინსტრუქციის წაშლა
  delete: async (id: number) => {
    const { error } = await supabase.from('tutorials').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};