import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jdwcgbwcwkrrvaqtokju.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkd2NnYndjd2tycnZhcXRva2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM2ODg3ODAsImV4cCI6MjAxOTI2NDc4MH0.GqxL-0KkZQS9PnvRmVnzPxHgB4_K4CZqQX4ECyHoj68';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});