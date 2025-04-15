import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// ეს გარემოს ცვლადები უნდა იყოს განსაზღვრული .env ფაილში
// შექმენით .env ფაილი პროექტის ძირითად დირექტორიაში და დაამატეთ:
// VITE_SUPABASE_URL=https://[your-project-id].supabase.co
// VITE_SUPABASE_ANON_KEY=your-anon-key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Supabase კლიენტის შექმნა
// ეს კლიენტი გამოიყენება აპლიკაციაში Supabase-თან კავშირისთვის
// მისი საშუალებით შეგიძლიათ მონაცემების წაკითხვა, ჩაწერა, განახლება და წაშლა
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// გამოყენების მაგალითი:
// const { data, error } = await supabase.from('tips').select('*');
// const { data, error } = await supabase.from('tutorials').select('*');