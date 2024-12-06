import { useEffect, useState } from "react";
import { JobCard } from "./JobCard";
import { JobFilters } from "./filters/JobFilters";
import { ActiveFilters } from "./filters/ActiveFilters";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  seniority: string;
  salary_range: string;
  contract_type: string;
  benefits?: string[];
  requirements?: string[];
  responsibilities?: string[];
  views?: number;
  applications?: number;
}

interface JobsListProps {
  searchQuery: string;
}

interface JobResponse {
  id: string;
  title: string;
  description: string;
  work_model: string | null;
  experience_level: string | null;
  salary_range: string | null;
  contract_type: string | null;
  benefits: string | null;
  requirements: string[] | null;
  responsibilities: string[] | null;
  views_count: number | null;
  applications_count: number | null;
  companies: {
    company_name: string;
    location: string | null;
  } | null;
}

const fetchJobs = async () => {
  const { data, error } = await supabase
    .from('jobs')
    .select(`
      *,
      companies:company_id (
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

export function JobsList({ searchQuery }: JobsListProps) {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedSeniority, setSelectedSeniority] = useState<string>("all");
  const [selectedContract, setSelectedContract] = useState<string>("all");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  useEffect(() => {
    let filtered = jobs;

    // Text search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
      );
    }

    // Job type filter
    if (selectedType && selectedType !== "all") {
      filtered = filtered.filter(job => job.type === selectedType);
    }

    // Seniority filter
    if (selectedSeniority && selectedSeniority !== "all") {
      filtered = filtered.filter(job => job.seniority === selectedSeniority);
    }

    // Contract type filter
    if (selectedContract && selectedContract !== "all") {
      filtered = filtered.filter(job => job.contract_type === selectedContract);
    }

    setFilteredJobs(filtered);

    // Update active filters
    const newActiveFilters = [];
    if (selectedType !== "all") newActiveFilters.push(`Tipo: ${selectedType}`);
    if (selectedSeniority !== "all") newActiveFilters.push(`Senioridade: ${selectedSeniority}`);
    if (selectedContract !== "all") newActiveFilters.push(`Contrato: ${selectedContract}`);
    setActiveFilters(newActiveFilters);

  }, [searchQuery, selectedType, selectedSeniority, selectedContract, jobs]);

  const clearFilter = (filter: string) => {
    const filterType = filter.split(":")[0].trim();
    switch (filterType) {
      case "Tipo":
        setSelectedType("all");
        break;
      case "Senioridade":
        setSelectedSeniority("all");
        break;
      case "Contrato":
        setSelectedContract("all");
        break;
    }
  };

  const uniqueTypes = Array.from(new Set(jobs.map(job => job.type)));
  const uniqueSeniorities = Array.from(new Set(jobs.map(job => job.seniority)));
  const uniqueContracts = Array.from(new Set(jobs.map(job => job.contract_type)));

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Erro ao carregar as vagas. Por favor, tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <JobFilters
        selectedType={selectedType}
        selectedSeniority={selectedSeniority}
        selectedContract={selectedContract}
        uniqueTypes={uniqueTypes}
        uniqueSeniorities={uniqueSeniorities}
        uniqueContracts={uniqueContracts}
        onTypeChange={setSelectedType}
        onSeniorityChange={setSelectedSeniority}
        onContractChange={setSelectedContract}
      />

      <ActiveFilters 
        filters={activeFilters}
        onClearFilter={clearFilter}
      />

      <div className="space-y-6">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhuma vaga encontrada com os filtros selecionados.</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))
        )}
      </div>
    </div>
  );
}