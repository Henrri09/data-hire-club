import { Briefcase, MapPin } from "lucide-react";
import { Button } from "../ui/button";

interface JobCardProps {
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    type: string;
    description: string;
    seniority: string;
    salary_range: string;
    contract_type: string;
  };
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow w-full max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold mb-2 text-[#1e293b]">{job.title}</h3>
      <p className="text-[#1e293b]/80 mb-4">{job.company}</p>
      <div className="flex gap-4 text-[#1e293b]/70 mb-4">
        <span className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Briefcase className="w-4 h-4" />
          {job.type}
        </span>
      </div>
      <p className="text-[#1e293b]/80 mb-4">{job.description}</p>
      <div className="space-y-2">
        <p className="text-sm text-[#1e293b]/70">Senioridade: {job.seniority}</p>
        <p className="text-sm text-[#1e293b]/70">Faixa Salarial: {job.salary_range}</p>
        <p className="text-sm text-[#1e293b]/70">Contratação: {job.contract_type}</p>
      </div>
      <Button variant="outline" className="w-full mt-4">
        Ver Detalhes
      </Button>
    </div>
  );
}