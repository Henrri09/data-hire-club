import { useState, useEffect, useCallback } from "react";
import { JobCard } from "./JobCard";
import { JobFilters } from "./filters/JobFilters";
import { ActiveFilters } from "./filters/ActiveFilters";
import { useJobsData } from "@/hooks/useJobsData";
import { JobsLoadingState } from "./JobsLoadingState";
import { JobsErrorState } from "./JobsErrorState";
import { EmptyJobsList } from "./EmptyJobsList";
import { Job } from "@/types/job.types";
import { useAnalytics } from "@/hooks/useAnalytics";

interface JobsListProps {
  searchQuery: string;
}

export function JobsList({ searchQuery }: JobsListProps) {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedSeniority, setSelectedSeniority] = useState<string>("all");
  const [selectedContract, setSelectedContract] = useState<string>("all");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const { trackJobSearch } = useAnalytics();

  const { jobs, isLoading, error } = useJobsData(searchQuery);

  const filterJobs = useCallback(() => {
    let filtered = jobs;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
      );
      
      trackJobSearch(searchQuery, filtered.length);
    }

    if (selectedType !== "all") {
      filtered = filtered.filter(job => job.type === selectedType);
    }

    if (selectedSeniority !== "all") {
      filtered = filtered.filter(job => job.seniority === selectedSeniority);
    }

    if (selectedContract !== "all") {
      filtered = filtered.filter(job => job.contract_type === selectedContract);
    }

    return filtered;
  }, [jobs, searchQuery, selectedType, selectedSeniority, selectedContract, trackJobSearch]);

  useEffect(() => {
    const filtered = filterJobs();
    setFilteredJobs(filtered);

    const newActiveFilters = [];
    if (selectedType !== "all") newActiveFilters.push(`Tipo: ${selectedType}`);
    if (selectedSeniority !== "all") newActiveFilters.push(`Senioridade: ${selectedSeniority}`);
    if (selectedContract !== "all") newActiveFilters.push(`Contrato: ${selectedContract}`);
    setActiveFilters(newActiveFilters);
  }, [filterJobs, selectedType, selectedSeniority, selectedContract]);

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

  if (isLoading) return <JobsLoadingState />;
  if (error) return <JobsErrorState />;

  const uniqueTypes = Array.from(new Set(jobs.map(job => job.type)));
  const uniqueSeniorities = Array.from(new Set(jobs.map(job => job.seniority)));
  const uniqueContracts = Array.from(new Set(jobs.map(job => job.contract_type)));

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
          <EmptyJobsList />
        ) : (
          filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))
        )}
      </div>
    </div>
  );
}