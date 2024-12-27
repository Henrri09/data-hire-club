import { CandidateHeader } from "@/components/candidate/Header";
import { CandidateSidebar } from "@/components/candidate/Sidebar";
import { ProfileOverview } from "@/components/candidate/ProfileOverview";
import { Leaderboard } from "@/components/gamification/Leaderboard";

export default function CandidateDashboard() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <CandidateHeader />
      <div className="flex flex-1">
        <CandidateSidebar />
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <ProfileOverview />
            <Leaderboard />
          </div>
        </main>
      </div>
    </div>
  );
}