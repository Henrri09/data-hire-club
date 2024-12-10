import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CandidateDashboard from "./pages/candidate/Dashboard";
import CandidateJobs from "./pages/candidate/Jobs";
import CompanyDashboard from "./pages/company/Dashboard";
import CompanyLogin from "./pages/company/Login";
import CompanyRegister from "./pages/company/Register";
import Introductions from "./pages/candidate/community/Introductions";
import Learning from "./pages/candidate/community/Learning";
import Questions from "./pages/candidate/community/Questions";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rotas protegidas para candidatos */}
        <Route path="/candidate/dashboard" element={
          <ProtectedRoute requiredUserType="candidate">
            <CandidateDashboard />
          </ProtectedRoute>
        } />
        <Route path="/candidate/jobs" element={
          <ProtectedRoute requiredUserType="candidate">
            <CandidateJobs />
          </ProtectedRoute>
        } />
        <Route path="/candidate/jobs/community/introductions" element={
          <ProtectedRoute requiredUserType="candidate">
            <Introductions />
          </ProtectedRoute>
        } />
        <Route path="/candidate/jobs/community/learning" element={
          <ProtectedRoute requiredUserType="candidate">
            <Learning />
          </ProtectedRoute>
        } />
        <Route path="/candidate/jobs/community/questions" element={
          <ProtectedRoute requiredUserType="candidate">
            <Questions />
          </ProtectedRoute>
        } />
        
        {/* Rotas protegidas para empresas */}
        <Route path="/company/dashboard" element={
          <ProtectedRoute requiredUserType="company">
            <CompanyDashboard />
          </ProtectedRoute>
        } />
        <Route path="/company/login" element={<CompanyLogin />} />
        <Route path="/company/register" element={<CompanyRegister />} />
      </Routes>
    </Router>
  );
}

export default App;