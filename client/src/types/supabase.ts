export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      recipes: {
        Row: {
          id: number
          title: string
          description: string
          image_url: string | null
          category: string
          prep_time: number
          cook_time: number
          servings: number
          difficulty: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          description: string
          image_url?: string | null
          category: string
          prep_time: number
          cook_time: number
          servings: number
          difficulty: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string
          image_url?: string | null
          category?: string
          prep_time?: number
          cook_time?: number
          servings?: number
          difficulty?: string
          created_at?: string
          updated_at?: string
        }
      }
      ingredients: {
        Row: {
          id: number
          recipe_id: number
          name: string
          amount: string
          unit: string
          created_at: string
        }
        Insert: {
          id?: number
          recipe_id: number
          name: string
          amount: string
          unit: string
          created_at?: string
        }
        Update: {
          id?: number
          recipe_id?: number
          name?: string
          amount?: string
          unit?: string
          created_at?: string
        }
      }
      steps: {
        Row: {
          id: number
          recipe_id: number
          step_number: number
          instruction: string
          created_at: string
        }
        Insert: {
          id?: number
          recipe_id: number
          step_number: number
          instruction: string
          created_at?: string
        }
        Update: {
          id?: number
          recipe_id?: number
          step_number?: number
          instruction?: string
          created_at?: string
        }
      }
      news: {
        Row: {
          id: number
          title: string
          content: string
          image_url: string | null
          video_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          content: string
          image_url?: string | null
          video_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          content?: string
          image_url?: string | null
          video_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tutorials: {
        Row: {
          id: number
          title: string
          content: string
          category: string
          image_url: string | null
          read_time: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          content: string
          category: string
          image_url?: string | null
          read_time: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          content?: string
          category?: string
          image_url?: string | null
          read_time?: string
          created_at?: string
          updated_at?: string
        }
      }
      tips: {
        Row: {
          id: number
          title: string
          content: string
          category: string
          is_tip_of_day: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          content: string
          category: string
          is_tip_of_day?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          content?: string
          category?: string
          is_tip_of_day?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}