import { QueryClient } from "@tanstack/react-query";
import * as api from './api';

// API ფუნქციების მეპინგი queryKey-ებზე
const apiMapping: Record<string, Function> = {
  // რეცეპტები
  '/api/georgian-recipes': api.getAllRecipes,
  '/api/recipes': api.getAllRecipes,
  
  // სიახლეები
  '/api/news': api.getAllNews,
  
  // ტუტორიალები
  '/api/tutorials': api.getAllTutorials,
  
  // რჩევები
  '/api/tips': api.getAllTips,
  '/api/tips/daily': api.getTipOfDay,
};

// ფუნქცია, რომელიც გამოიყენება API მოთხოვნების გასაგზავნად
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<any> {
  // ვიყენებთ Supabase API ფუნქციებს
  if (method === 'GET' && apiMapping[url]) {
    return apiMapping[url]();
  }
  
  // თუ ფუნქცია არ არის მეპინგში, ვაბრუნებთ შეცდომას
  throw new Error(`API endpoint not found: ${url}`);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const endpoint = queryKey[0] as string;
        const id = queryKey.length > 1 ? queryKey[1] : undefined;
        
        // თუ გვაქვს ID, ვიყენებთ შესაბამის getById ფუნქციას
        if (id !== undefined) {
          if (endpoint === '/api/georgian-recipes' || endpoint === '/api/recipes') {
            return api.getRecipeById(id as number);
          } else if (endpoint === '/api/news') {
            return api.getNewsById(id as number);
          } else if (endpoint === '/api/tutorials') {
            return api.getTutorialById(id as number);
          } else if (endpoint === '/api/tips') {
            return api.getTipById(id as number);
          }
        }
        
        // თუ გვაქვს საძიებო პარამეტრი
        if (queryKey.length > 1 && typeof queryKey[1] === 'object' && 'search' in (queryKey[1] as any)) {
          const { search } = queryKey[1] as { search: string };
          if (endpoint === '/api/tutorials') {
            return api.searchTutorials(search);
          }
        }
        
        // სტანდარტული მოთხოვნები
        if (apiMapping[endpoint]) {
          return apiMapping[endpoint]();
        }
        
        throw new Error(`API endpoint not found: ${endpoint}`);
      },
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
