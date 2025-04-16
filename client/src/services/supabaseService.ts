import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

// ტიპები Supabase-ის ცხრილებისთვის
type Recipe = Database['public']['Tables']['recipes']['Insert'];
type Tip = Database['public']['Tables']['tips']['Insert'];
type Tutorial = Database['public']['Tables']['tutorials']['Insert'];

/**
 * რეცეპტების სერვისი
 */
export const recipeService = {
  // ყველა რეცეპტის მიღება
  getAll: async () => {
    try {
      const response = await fetch('/api/georgian-recipes');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw new Error(`Failed to fetch Georgian recipes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // რეცეპტის მიღება ID-ით
  getById: async (id: number) => {
    try {
      const response = await fetch(`/api/georgian-recipes/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching recipe:', error);
      throw new Error(`Failed to fetch Georgian recipe: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // ახალი რეცეპტის შექმნა
  create: async (recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const recipeData = {
        recipe: {
          ...recipe,
        },
        ingredients: [],
        steps: []
      };
      
      const response = await fetch('/api/georgian-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipeData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw new Error(`Failed to create Georgian recipe: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // რეცეპტის განახლება
  update: async (id: number, recipe: Partial<Omit<Recipe, 'id' | 'created_at'>>) => {
    try {
      const recipeData = {
        recipe: {
          ...recipe,
        },
        ingredients: [],
        steps: []
      };
      
      const response = await fetch(`/api/georgian-recipes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipeData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating recipe:', error);
      throw new Error(`Failed to update Georgian recipe: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // რეცეპტის წაშლა
  delete: async (id: number) => {
    try {
      const response = await fetch(`/api/georgian-recipes/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw new Error(`Failed to delete Georgian recipe: ${error instanceof Error ? error.message : 'Unknown error'}`);
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