import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CompanyLogin from "./pages/company/Login";
import CompanyRegister from "./pages/company/Register";
import CompanyDashboard from "./pages/company/Dashboard";
import CandidateDashboard from "./pages/candidate/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<><Navbar /><Index /></>} />
          <Route path="/login" element={<><Navbar /><Login /></>} />
          <Route path="/register" element={<><Navbar /><Register /></>} />
          <Route path="/company/login" element={<><Navbar /><CompanyLogin /></>} />
          <Route path="/company/register" element={<><Navbar /><CompanyRegister /></>} />
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;