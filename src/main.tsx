import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ReactGA from 'react-ga4'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { supabase } from './integrations/supabase/client'
import App from './App'
import './index.css'
import { Toaster } from "@/components/ui/toaster"

// Initialize Google Analytics
ReactGA.initialize('G-XXXXXXXXXX')

// Create a client
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <App />
        <Toaster />
      </SessionContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
)