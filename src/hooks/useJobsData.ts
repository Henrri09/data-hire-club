
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Job, JobResponse } from "@/types/job.types";

const fetchJobs = async (): Promise<Job[]> => {
  console.log('Fetching jobs...');

  try {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        companies (
          name,
          location
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }

    if (!data) {
      console.log('No jobs found');
      return [];
    }

    console.log('Jobs fetched successfully:', data);

    // Use a type assertion here to handle the raw data
    return data.map(job => ({
      id: job.id,
      title: job.title,
      company: job.companies?.name || 'Empresa não especificada',
      location: job.companies?.location || 'Localização não especificada',
      type: job.work_model || 'Não especificado',
      description: job.description,
      seniority: job.experience_level || 'Não especificado',
      salary_range: job.salary_range || 'A combinar',
      contract_type: job.contract_type || 'Não especificado',
      benefits: job.benefits ? JSON.parse(job.benefits as string) : undefined,
      requirements: job.requirements || [],
      responsibilities: job.responsibilities || [],
      views: job.views_count || 0,
      applications: job.applications_count || 0
    }));
  } catch (error) {
    console.error('Error in fetchJobs:', error);
    throw error;
  }
};

export const useJobsData = (searchQuery: string) => {
  return useQuery({
    queryKey: ['jobs', searchQuery],
    queryFn: fetchJobs,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
