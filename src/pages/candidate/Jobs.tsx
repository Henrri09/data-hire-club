import { useState } from "react";
import { CandidateHeader } from "@/components/candidate/Header";
import { CandidateSidebar } from "@/components/candidate/Sidebar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { JobsList } from "@/components/jobs/JobsList";

export default function CandidateJobs() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <CandidateHeader />
      <div className="flex">
        <CandidateSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Vagas Disponíveis</h1>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar vagas por título, empresa ou localização..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Jobs List */}
            <JobsList searchQuery={searchQuery} />
          </div>
        </main>
      </div>
    </div>
  );
}