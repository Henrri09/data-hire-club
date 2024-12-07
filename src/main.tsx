import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ReactGA from 'react-ga4'
import App from './App.tsx'
import './index.css'

// Inicializa o Google Analytics
ReactGA.initialize('G-XXXXXXXXXX')

// Create a client
const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);