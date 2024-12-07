import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Job, JobResponse } from "@/types/job.types";

const fetchJobs = async () => {
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      companies (
        company_name,
        location
      )
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data as unknown as JobResponse[]).map(job => ({
    id: job.id,
    title: job.title,
    company: job.companies?.company_name || 'Empresa não especificada',
    location: job.companies?.location || 'Localização não especificada',
    type: job.work_model || 'Não especificado',
    description: job.description,
    seniority: job.experience_level || 'Não especificado',
    salary_range: job.salary_range || 'A combinar',
    contract_type: job.contract_type || 'Não especificado',
    benefits: job.benefits ? JSON.parse(job.benefits) : undefined,
    requirements: job.requirements,
    responsibilities: job.responsibilities,
    views: job.views_count,
    applications: job.applications_count
  }));
};

export const useJobsData = (searchQuery: string) => {
  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

  return {
    jobs,
    isLoading,
    error
  };
};