import { useEffect, useState } from "react";
import { JobCard } from "./JobCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const MOCK_JOBS = [
  {
    id: "1",
    title: "Engenheiro de Dados Sênior",
    company: "TechBR Solutions",
    location: "São Paulo, SP",
    type: "Remoto",
    description: "Experiência com Apache Spark, AWS e ferramentas de ETL.",
    seniority: "Sênior",
    salary_range: "R$ 18.000 - R$ 22.000",
    contract_type: "CLT",
    benefits: ["Vale Refeição", "Plano de Saúde", "Gympass"],
    requirements: [
      "5+ anos de experiência com Big Data",
      "Conhecimento avançado em Python",
      "AWS Certified"
    ],
    responsibilities: [
      "Desenvolver pipelines de dados",
      "Otimizar processos de ETL",
      "Mentoria técnica"
    ]
  },
  {
    id: "2",
    title: "Cientista de Dados",
    company: "Data Analytics Co",
    location: "Rio de Janeiro, RJ",
    type: "Híbrido",
    description: "Forte conhecimento em Machine Learning e Python.",
    seniority: "Pleno",
    salary_range: "R$ 12.000 - R$ 15.000",
    contract_type: "PJ"
  },
  {
    id: "3",
    title: "Analista de Business Intelligence",
    company: "Finance Tech",
    location: "Curitiba, PR",
    type: "Presencial",
    description: "Experiência com Power BI e SQL Server.",
    seniority: "Júnior",
    salary_range: "R$ 5.000 - R$ 7.000",
    contract_type: "CLT"
  },
  {
    id: "4",
    title: "Arquiteto de Dados",
    company: "Cloud Systems",
    location: "Belo Horizonte, MG",
    type: "Remoto",
    description: "Experiência em modelagem de dados e cloud computing.",
    seniority: "Sênior",
    salary_range: "R$ 20.000 - R$ 25.000",
    contract_type: "PJ"
  },
  {
    id: "5",
    title: "Analista de Dados",
    company: "E-commerce Brasil",
    location: "Florianópolis, SC",
    type: "Híbrido",
    description: "Conhecimento em SQL, Python e ferramentas de visualização.",
    seniority: "Pleno",
    salary_range: "R$ 8.000 - R$ 10.000",
    contract_type: "CLT"
  }
];

interface JobsListProps {
  searchQuery: string;
}

export function JobsList({ searchQuery }: JobsListProps) {
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedSeniority, setSelectedSeniority] = useState<string>("");
  const [selectedContract, setSelectedContract] = useState<string>("");
  const [filteredJobs, setFilteredJobs] = useState(MOCK_JOBS);

  useEffect(() => {
    let filtered = MOCK_JOBS;

    // Text search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
      );
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter(job => job.location === selectedLocation);
    }

    // Job type filter
    if (selectedType) {
      filtered = filtered.filter(job => job.type === selectedType);
    }

    // Seniority filter
    if (selectedSeniority) {
      filtered = filtered.filter(job => job.seniority === selectedSeniority);
    }

    // Contract type filter
    if (selectedContract) {
      filtered = filtered.filter(job => job.contract_type === selectedContract);
    }

    setFilteredJobs(filtered);
  }, [searchQuery, selectedLocation, selectedType, selectedSeniority, selectedContract]);

  const uniqueLocations = Array.from(new Set(MOCK_JOBS.map(job => job.location)));
  const uniqueTypes = Array.from(new Set(MOCK_JOBS.map(job => job.type)));
  const uniqueSeniorities = Array.from(new Set(MOCK_JOBS.map(job => job.seniority)));
  const uniqueContracts = Array.from(new Set(MOCK_JOBS.map(job => job.contract_type)));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="space-y-2">
          <Label>Localização</Label>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as localizações" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as localizações</SelectItem>
              {uniqueLocations.map(location => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tipo de Trabalho</Label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os tipos</SelectItem>
              {uniqueTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Senioridade</Label>
          <Select value={selectedSeniority} onValueChange={setSelectedSeniority}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as senioridades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as senioridades</SelectItem>
              {uniqueSeniorities.map(seniority => (
                <SelectItem key={seniority} value={seniority}>{seniority}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tipo de Contrato</Label>
          <Select value={selectedContract} onValueChange={setSelectedContract}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os contratos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os contratos</SelectItem>
              {uniqueContracts.map(contract => (
                <SelectItem key={contract} value={contract}>{contract}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        {filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
