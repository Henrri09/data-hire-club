import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { JobCard } from "./JobCard";
import { JobsLoadingState } from "./JobsLoadingState";
import { JobsErrorState } from "./JobsErrorState";
import { EmptyJobsList } from "./EmptyJobsList";
import type { Job } from "@/types/job.types";
import type { Database } from "@/integrations/supabase/types";

import type { JobFilters } from "./filters/JobFiltersModal";

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
              const matchesWorkType = filters.workType.some(filter => {
                const filterLower = filter.toLowerCase();
                return jobWorkType.includes(filterLower) || 
                       (filterLower === 'remoto' && (jobWorkType.includes('remote') || jobWorkType.includes('remoto'))) ||
                       (filterLower === 'hibrido' && (jobWorkType.includes('híbrido') || jobWorkType.includes('hybrid'))) ||
                       (filterLower === 'presencial' && (jobWorkType.includes('presencial') || jobWorkType.includes('on-site') || jobWorkType.includes('onsite')));
              });
              if (!matchesWorkType) return false;
            }

            // Filtro por tipo de contrato
            if (filters.contractType.length > 0) {
              const jobContractType = job.contract_type.toLowerCase();
              const matchesContract = filters.contractType.some(filter => {
                const filterLower = filter.toLowerCase();
                return jobContractType.includes(filterLower) ||
                       (filterLower === 'clt' && jobContractType.includes('clt')) ||
                       (filterLower === 'pj' && (jobContractType.includes('pj') || jobContractType.includes('pessoa jurídica'))) ||
                       (filterLower === 'freelancer' && (jobContractType.includes('freelancer') || jobContractType.includes('free')));
              });
              if (!matchesContract) return false;
            }

            // Filtro por senioridade
            if (filters.seniority.length > 0) {
              const jobSeniority = job.seniority.toLowerCase();
              const matchesSeniority = filters.seniority.some(filter => {
                const filterLower = filter.toLowerCase();
                return jobSeniority.includes(filterLower) ||
                       (filterLower === 'junior' && (jobSeniority.includes('júnior') || jobSeniority.includes('jr') || jobSeniority.includes('estagiário') || jobSeniority.includes('trainee'))) ||
                       (filterLower === 'pleno' && (jobSeniority.includes('pleno') || jobSeniority.includes('mid'))) ||
                       (filterLower === 'senior' && (jobSeniority.includes('sênior') || jobSeniority.includes('sr') || jobSeniority.includes('senior')));
              });
              if (!matchesSeniority) return false;
            }

            // Filtro por faixa salarial - melhorado para extrair números reais
            if (filters.salaryRanges.length > 0) {
              const salary = job.salary_range.toLowerCase();
              // Extrair números do salário usando regex
              const salaryNumbers = salary.match(/\d+/g);
              
              const matchesSalary = filters.salaryRanges.some(range => {
                if (range === "0-3000") {
                  return salaryNumbers && salaryNumbers.some(num => {
                    const value = parseInt(num);
                    return value <= 3000 && value >= 1000;
                  });
                }
                if (range === "3000-6000") {
                  return salaryNumbers && salaryNumbers.some(num => {
                    const value = parseInt(num);
                    return value >= 3000 && value <= 6000;
                  });
                }
                if (range === "6000-10000") {
                  return salaryNumbers && salaryNumbers.some(num => {
                    const value = parseInt(num);
                    return value >= 6000 && value <= 10000;
                  });
                }
                if (range === "10000+") {
                  return salaryNumbers && salaryNumbers.some(num => {
                    const value = parseInt(num);
                    return value >= 10000;
                  });
                }
                return false;
              });
              if (!matchesSalary) return false;
            }

            // Filtro por tags de área de dados - expandido
            if (filters.dataTags.length > 0) {
              const jobContent = `${job.title} ${job.description}`.toLowerCase();
              const matchesTags = filters.dataTags.some(tag => {
                switch(tag) {
                  case 'data-analyst':
                    return jobContent.includes('analista') || jobContent.includes('analyst') || jobContent.includes('análise');
                  case 'data-scientist':
                    return jobContent.includes('cientista') || jobContent.includes('scientist') || jobContent.includes('ciência');
                  case 'data-engineer':
                    return jobContent.includes('engenheiro') || jobContent.includes('engineer') || jobContent.includes('engenharia');
                  case 'bi':
                    return jobContent.includes('bi') || jobContent.includes('business intelligence') || jobContent.includes('power bi');
                  case 'python':
                    return jobContent.includes('python');
                  case 'sql':
                    return jobContent.includes('sql') || jobContent.includes('mysql') || jobContent.includes('postgresql');
                  case 'ml':
                    return jobContent.includes('machine learning') || jobContent.includes('ml') || jobContent.includes('aprendizado');
                  case 'etl':
                    return jobContent.includes('etl') || jobContent.includes('extract') || jobContent.includes('pipeline');
                  default:
                    return jobContent.includes(tag.replace('-', ' '));
                }
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