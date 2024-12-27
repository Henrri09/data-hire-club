import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://jdwcgbwcwkrrvaqtokju.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkd2NnYndjd2tycnZhcXRva2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4MzE5ODYsImV4cCI6MjA0ODQwNzk4Nn0.WRbMpo-G6qhRa0vMKHbdi5GHyRzvYslXBdnJ5Ebw9pA';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
});