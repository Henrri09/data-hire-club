import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Eye } from "lucide-react";
import supabase from "@/integrations/supabase/client";

interface Stats {
  activeJobs: number;
  totalViews: number;
}

export function OverviewTab() {
  const [stats, setStats] = useState<Stats>({
    activeJobs: 0,
    totalViews: 0
  });

  useEffect(() => {
    fetchCompanyStats();
  }, []);

  const fetchCompanyStats = async () => {
    try {
      // Get current company's ID (from auth)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch active jobs count
      const { count: activeJobsCount } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', user.id)
        .eq('status', 'active')
        .is('deleted_at', null);

      // Fetch total views
      const { data: views } = await supabase
        .from('jobs')
        .select(`
          id,
          views_count
        `)
        .eq('company_id', user.id)
        .is('deleted_at', null);

      // Calculate total views
      const totalViews = views?.reduce((sum, job) =>
        sum + (job.views_count || 0), 0) || 0;

      setStats({
        activeJobs: activeJobsCount || 0,
        totalViews
      });
    } catch (error) {
      console.error('Error fetching company stats:', error);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">Vagas Ativas</CardTitle>
          <Briefcase className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold">{stats.activeJobs}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">Visualizações</CardTitle>
          <Eye className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold">{stats.totalViews}</div>
        </CardContent>
      </Card>
    </div>
  );
}