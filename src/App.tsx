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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/candidate/jobs" element={<CandidateJobs />} />
        <Route path="/candidate/jobs/community/introductions" element={<Introductions />} />
        <Route path="/candidate/jobs/community/learning" element={<Learning />} />
        <Route path="/candidate/jobs/community/questions" element={<Questions />} />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/company/login" element={<CompanyLogin />} />
        <Route path="/company/register" element={<CompanyRegister />} />
      </Routes>
    </Router>
  );
}

export default App;