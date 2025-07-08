import { useState } from "react";
import { MapPin, Briefcase, Users, X, Filter } from "lucide-react";
import { FilterButton } from "./FilterButton";
import { SalaryRangeFilter } from "./SalaryRangeFilter";
import { DataAreaTags } from "./DataAreaTags";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface JobFilters {
  workType: string[];
  contractType: string[];
  seniority: string[];
  salaryRanges: string[];
  dataTags: string[];
}

interface JobFiltersBarProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  jobCount?: number;
}

const workTypes = [
  { label: "Remoto", value: "remoto" },
  { label: "Presencial", value: "presencial" },
  { label: "Híbrido", value: "hibrido" },
];

const contractTypes = [
  { label: "CLT", value: "clt" },
  { label: "PJ", value: "pj" },
  { label: "Freelancer", value: "freelancer" },
];

const seniorityLevels = [
  { label: "Júnior", value: "junior" },
  { label: "Pleno", value: "pleno" },
  { label: "Sênior", value: "senior" },
];

export function JobFiltersBar({ filters, onFiltersChange, jobCount }: JobFiltersBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleFilter = (category: keyof JobFilters, value: string) => {
    const currentValues = filters[category] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFiltersChange({
      ...filters,
      [category]: newValues,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      workType: [],
      contractType: [],
      seniority: [],
      salaryRanges: [],
      dataTags: [],
    });
  };

  const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0);
  const totalActiveFilters = Object.values(filters).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <Card className="p-4 mb-6 bg-background/50 backdrop-blur-sm border-muted">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros
            {totalActiveFilters > 0 && (
              <Badge variant="secondary" className="ml-1">
                {totalActiveFilters}
              </Badge>
            )}
          </Button>
          {jobCount !== undefined && (
            <span className="text-sm text-muted-foreground">
              {jobCount} vaga{jobCount !== 1 ? 's' : ''} encontrada{jobCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar filtros
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tipo de Trabalho */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Tipo de Trabalho
              </h3>
              <div className="flex flex-wrap gap-2">
                {workTypes.map((type) => (
                  <FilterButton
                    key={type.value}
                    label={type.label}
                    isActive={filters.workType.includes(type.value)}
                    onClick={() => toggleFilter('workType', type.value)}
                  />
                ))}
              </div>
            </div>

            {/* Tipo de Contrato */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Contrato
              </h3>
              <div className="flex flex-wrap gap-2">
                {contractTypes.map((type) => (
                  <FilterButton
                    key={type.value}
                    label={type.label}
                    isActive={filters.contractType.includes(type.value)}
                    onClick={() => toggleFilter('contractType', type.value)}
                  />
                ))}
              </div>
            </div>

            {/* Senioridade */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Senioridade
              </h3>
              <div className="flex flex-wrap gap-2">
                {seniorityLevels.map((level) => (
                  <FilterButton
                    key={level.value}
                    label={level.label}
                    isActive={filters.seniority.includes(level.value)}
                    onClick={() => toggleFilter('seniority', level.value)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Faixa Salarial */}
            <SalaryRangeFilter
              selectedRanges={filters.salaryRanges}
              onRangeToggle={(range) => toggleFilter('salaryRanges', range)}
            />

            {/* Tags de Área */}
            <DataAreaTags
              selectedTags={filters.dataTags}
              onTagToggle={(tag) => toggleFilter('dataTags', tag)}
            />
          </div>

          {/* Filtros Ativos */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium mb-3">Filtros ativos:</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([category, values]) =>
                  values.map((value) => (
                    <Badge
                      key={`${category}-${value}`}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      onClick={() => toggleFilter(category as keyof JobFilters, value)}
                    >
                      {value}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}