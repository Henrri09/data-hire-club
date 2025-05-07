
import { createClient } from "@supabase/supabase-js";

// Definir valores padrão para o ambiente de desenvolvimento
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jdwcgbwcwkrrvaqtokju.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkd2NnYndjd2tycnZhcXRva2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4MzE5ODYsImV4cCI6MjA0ODQwNzk4Nn0.WRbMpo-G6qhRa0vMKHbdi5GHyRzvYslXBdnJ5Ebw9pA';

// Verificar se temos as variáveis necessárias
if (!supabaseUrl || !supabaseKey) {
  console.error('Erro crítico: Variáveis de ambiente do Supabase não encontradas');
}

// Criar o cliente Supabase com configurações explícitas de autenticação
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: localStorage
  }
});

export default supabase;
