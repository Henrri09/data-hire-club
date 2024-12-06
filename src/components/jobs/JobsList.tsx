import { JobCard } from "./JobCard";

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
    contract_type: "CLT"
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
  const filteredJobs = MOCK_JOBS.filter(job => 
    searchQuery === "" || 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {filteredJobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}