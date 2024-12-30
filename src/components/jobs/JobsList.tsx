import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { JobCard } from "./JobCard";
import { JobsLoadingState } from "./JobsLoadingState";
import { JobsErrorState } from "./JobsErrorState";
import { EmptyJobsList } from "./EmptyJobsList";
import type { Job } from "@/types/job.types";

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

        console.log("Jobs fetched successfully:", data);
        setJobs(data || []);
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