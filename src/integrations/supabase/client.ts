import { createClient } from "@supabase/supabase-js";

const defaultValues = {
  lovable: {
    url: "https://jdwcgbwcwkrrvaqtokju.supabase.co",
    key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkd2NnYndjd2tycnZhcXRva2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4MzE5ODYsImV4cCI6MjA0ODQwNzk4Nn0.WRbMpo-G6qhRa0vMKHbdi5GHyRzvYslXBdnJ5Ebw9pA"
  }
};

const isLovable = () => {
  try {
    return import.meta.env.VITE_LOVABLE === "true" ||
           typeof window !== "undefined" &&
           window.location.hostname.includes("lovable");
  } catch (e) {
    return false;
  }
};


const currentEnv = isLovable() ? "lovable" : (import.meta.env.MODE || "development");

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || defaultValues[currentEnv]?.url;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultValues[currentEnv]?.key;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
