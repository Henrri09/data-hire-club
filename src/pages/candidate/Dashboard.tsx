import { CandidateHeader } from "@/components/candidate/Header";
import { CandidateSidebar } from "@/components/candidate/Sidebar";
import { ProfileOverview } from "@/components/candidate/ProfileOverview";
import { Leaderboard } from "@/components/gamification/Leaderboard";
import { useIsMobile } from "@/hooks/use-mobile";

export default function CandidateDashboard() {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <CandidateHeader />
      <div className="flex">
        {!isMobile && <CandidateSidebar />}
        <main className="flex-1 py-6 px-4 md:py-8 md:px-8">
          <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
            <ProfileOverview />
            <Leaderboard />
          </div>
        </main>
      </div>
    </div>
  );
}