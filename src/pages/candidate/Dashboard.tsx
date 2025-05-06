import { CandidateHeader } from "@/components/candidate/Header";
import { CandidateSidebar } from "@/components/candidate/Sidebar";
import { ProfileOverview } from "@/components/candidate/ProfileOverview";
import { Leaderboard } from "@/components/gamification/Leaderboard";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect } from "react";
import supabase from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@supabase/auth-helpers-react";


export default function CandidateDashboard() {
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Session check error:', error);
        toast({
          title: "Erro ao verificar sessão",
          description: "Por favor, faça login novamente",
          variant: "destructive",
        });
        return;
      }

      if (!session) {
        toast({
          title: "Sessão expirada",
          description: "Por favor, faça login novamente",
          variant: "destructive",
        });
      }
    };

    checkSession();
  }, [toast]);

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