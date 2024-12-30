import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { JobCard } from "./JobCard";
import { JobsLoadingState } from "./JobsLoadingState";
import { JobsErrorState } from "./JobsErrorState";
import { EmptyJobsList } from "./EmptyJobsList";
import type { Job, JobResponse } from "@/types/job.types";

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

        let query = supabase
          .from('jobs')
          .select(`
            *,
            company:companies(*)
          `)
          .eq('status', 'active')
          .is('deleted_at', null);

        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        const formattedJobs: Job[] = (data as JobResponse[]).map(job => ({
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
          requirements: job.requirements || [],
          responsibilities: job.responsibilities || [],
          views: job.views_count || 0,
          applications: job.applications_count || 0
        }));

        setJobs(formattedJobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch jobs'));
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