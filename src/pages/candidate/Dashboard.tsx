import { useEffect, useState } from "react";
import { CandidateHeader } from "@/components/candidate/Header";
import { CandidateSidebar } from "@/components/candidate/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileOverview } from "@/components/candidate/ProfileOverview";
import { useQuery } from "@tanstack/react-query";

interface Application {
  id: string;
  created_at: string;
  job: {
    title: string;
    company: {
      company_name: string;
    };
  };
}

export default function CandidateDashboard() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const { data: applications = [], isLoading: isLoadingApplications } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          id,
          created_at,
          job:jobs(
            title,
            company:companies(company_name)
          )
        `)
        .eq('candidate_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <CandidateHeader />
      <div className="flex flex-1">
        <CandidateSidebar />
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
            <ProfileOverview />

            {/* Applications Card */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Minhas Candidaturas</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingApplications ? (
                  <div className="space-y-4">
                    <div className="h-20 bg-gray-100 animate-pulse rounded-lg" />
                    <div className="h-20 bg-gray-100 animate-pulse rounded-lg" />
                  </div>
                ) : applications.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Você ainda não tem candidaturas.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div
                        key={application.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-white border border-gray-100 hover:border-[#9b87f5]/30 transition-colors gap-4"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{application.job.title}</h3>
                          <p className="text-gray-600">{application.job.company.company_name}</p>
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                          <span className="text-sm text-gray-500">
                            {new Date(application.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}