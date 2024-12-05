import { useState } from "react";
import { CandidateHeader } from "@/components/candidate/Header";
import { CandidateSidebar } from "@/components/candidate/Sidebar";
import { ProfileOverview } from "@/components/candidate/ProfileOverview";
import { JobsList } from "@/components/jobs/JobsList";
import { EditProfileDialog } from "@/components/candidate/EditProfileDialog";

export default function CandidateDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-black">
      <CandidateHeader />
      <div className="flex">
        <CandidateSidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <ProfileOverview />
            <h2 className="text-2xl font-bold text-white">Vagas Disponíveis</h2>
            <JobsList searchQuery={searchQuery} />
          </div>
        </main>
      </div>
    </div>
  );
}