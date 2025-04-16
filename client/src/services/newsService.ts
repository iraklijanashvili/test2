import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

// ტიპები Supabase-ის ცხრილებისთვის
type News = Database['public']['Tables']['news']['Insert'];

/**
 * სიახლეების სერვისი
 */
export const newsService = {
  // ყველა სიახლის მიღება
  getAll: async () => {
    try {
      const { data, error } = await supabase.from('news').select('*');
      if (error) throw error;
      return { articles: data };
    } catch (error) {
      console.error('Error fetching news:', error);
      throw new Error(`Failed to fetch news: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // სიახლის მიღება ID-ით
  getById: async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw new Error(`Failed to fetch news: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // ახალი სიახლის შექმნა
  create: async (news: Omit<News, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('news')
        .insert({
          ...news,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating news:', error);
      throw new Error(`Failed to create news: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // სიახლის განახლება
  update: async (id: number, news: Partial<Omit<News, 'id' | 'created_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('news')
        .update({
          ...news,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating news:', error);
      throw new Error(`Failed to update news: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // სიახლის წაშლა
  delete: async (id: number) => {
    try {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting news:', error);
      throw new Error(`Failed to delete news: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};