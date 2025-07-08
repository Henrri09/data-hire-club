import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { JobCard } from "./JobCard";
import { JobsLoadingState } from "./JobsLoadingState";
import { JobsErrorState } from "./JobsErrorState";
import { EmptyJobsList } from "./EmptyJobsList";
import type { Job } from "@/types/job.types";
import type { Database } from "@/integrations/supabase/types";

import type { JobFilters } from "./filters/JobFiltersBar";

interface JobsListProps {
  searchQuery?: string;
  filters?: JobFilters;
}

export const JobsList = ({ searchQuery, filters }: JobsListProps) => {
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
              location,
              logo_url
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
          logo_url: job.companies?.logo_url,
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

        // Aplicar filtros se houver
        let filteredJobs = formattedJobs;
        
        if (filters) {
          filteredJobs = formattedJobs.filter(job => {
            // Filtro por tipo de trabalho
            if (filters.workType.length > 0) {
              const jobWorkType = job.type.toLowerCase();
              const matchesWorkType = filters.workType.some(filter => 
                jobWorkType.includes(filter) || 
                (filter === 'remoto' && jobWorkType.includes('remote')) ||
                (filter === 'hibrido' && jobWorkType.includes('híbrido'))
              );
              if (!matchesWorkType) return false;
            }

            // Filtro por tipo de contrato
            if (filters.contractType.length > 0) {
              const jobContractType = job.contract_type.toLowerCase();
              const matchesContract = filters.contractType.some(filter => 
                jobContractType.includes(filter)
              );
              if (!matchesContract) return false;
            }

            // Filtro por senioridade
            if (filters.seniority.length > 0) {
              const jobSeniority = job.seniority.toLowerCase();
              const matchesSeniority = filters.seniority.some(filter => 
                jobSeniority.includes(filter) ||
                (filter === 'junior' && (jobSeniority.includes('júnior') || jobSeniority.includes('estagiario'))) ||
                (filter === 'senior' && jobSeniority.includes('sênior'))
              );
              if (!matchesSeniority) return false;
            }

            // Filtro por faixa salarial
            if (filters.salaryRanges.length > 0) {
              const salary = job.salary_range.toLowerCase();
              const matchesSalary = filters.salaryRanges.some(range => {
                if (range === "0-3000") return salary.includes("3") && !salary.includes("6");
                if (range === "3000-6000") return salary.includes("3") && salary.includes("6");
                if (range === "6000-10000") return salary.includes("6") && salary.includes("10");
                if (range === "10000+") return salary.includes("10") || salary.includes("15") || salary.includes("20");
                return false;
              });
              if (!matchesSalary) return false;
            }

            // Filtro por tags de área de dados
            if (filters.dataTags.length > 0) {
              const jobContent = `${job.title} ${job.description}`.toLowerCase();
              const matchesTags = filters.dataTags.some(tag => {
                if (tag === 'data-analyst') return jobContent.includes('analista') || jobContent.includes('analyst');
                if (tag === 'data-scientist') return jobContent.includes('cientista') || jobContent.includes('scientist');
                if (tag === 'data-engineer') return jobContent.includes('engenheiro') || jobContent.includes('engineer');
                return jobContent.includes(tag.replace('-', ' '));
              });
              if (!matchesTags) return false;
            }

            return true;
          });
        }

        console.log('Vagas filtradas:', filteredJobs);
        setJobs(filteredJobs);
      } catch (err) {
        console.error("Erro ao buscar vagas:", err);
        setError(err instanceof Error ? err : new Error('Falha ao buscar vagas'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [searchQuery, filters]);

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