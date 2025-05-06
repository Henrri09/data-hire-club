import { useEffect, useState } from "react";
import supabase from "@/integrations/supabase/client";
import { JobCard } from "./JobCard";
import { JobsLoadingState } from "./JobsLoadingState";
import { JobsErrorState } from "./JobsErrorState";
import { EmptyJobsList } from "./EmptyJobsList";
import type { Job } from "@/types/job.types";
import type { Database } from "@/integrations/supabase/types";

interface JobsListProps {
  searchQuery?: string;
}

export const JobsList = ({ searchQuery }: JobsListProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('Iniciando busca de vagas...');
        console.log('Query de busca:', searchQuery);

        let query = supabase
          .from('jobs')
          .select(`
            *,
            companies (
              name,
              location
            )
          `)
          .eq('status', 'active')
          .is('deleted_at', null);

        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }

        const { data, error: fetchError } = await query;

        console.log('Dados recebidos:', data);

        if (fetchError) {
          console.error('Erro ao buscar vagas:', fetchError);
          throw new Error(fetchError.message);
        }

        console.log('Dados recebidos:', data);

        if (!data) {
          console.log('Nenhuma vaga encontrada');
          setJobs([]);
          return;
        }

        // Usando o tipo correto do Database Supabase
        type JobWithCompany = Database['public']['Tables']['jobs']['Row'] & {
          companies: Database['public']['Tables']['companies']['Row'] | null;
        };

        const formattedJobs: Job[] = (data as JobWithCompany[]).map(job => ({
          id: job.id,
          title: job.title,
          company: job.companies?.name || 'Empresa não especificada',
          location: job.companies?.location || 'Localização não especificada',
          type: job.work_model || 'Não especificado',
          description: job.description,
          seniority: job.experience_level || 'Não especificado',
          salary_range: job.salary_range || 'A combinar',
          contract_type: job.contract_type || 'Não especificado',
          application_url: job.external_link,
          benefits: job.benefits ? JSON.parse(job.benefits as string) : undefined,
          requirements: job.requirements || [],
          responsibilities: job.responsibilities || [],
          views: job.views_count || 0,
          applications: job.applications_count || 0
        }));

        console.log('Vagas formatadas:', formattedJobs);
        setJobs(formattedJobs);
      } catch (err) {
        console.error("Erro ao buscar vagas:", err);
        setError(err instanceof Error ? err : new Error('Falha ao buscar vagas'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [searchQuery]);

  if (isLoading) return <JobsLoadingState />;
  if (error) return <JobsErrorState error={error} />;
  if (jobs.length === 0) return <EmptyJobsList />;

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};