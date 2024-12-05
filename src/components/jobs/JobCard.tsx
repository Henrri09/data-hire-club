import { Briefcase, MapPin, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

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
    application_url?: string;
  };
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow w-full max-w-2xl mx-auto">
      <h3 className="text-lg md:text-xl font-semibold mb-2 text-[#1e293b]">{job.title}</h3>
      <p className="text-[#1e293b]/80 mb-3 md:mb-4">{job.company}</p>
      <div className="flex flex-wrap gap-3 md:gap-4 text-[#1e293b]/70 mb-3 md:mb-4">
        <span className="flex items-center gap-1 text-sm">
          <MapPin className="w-4 h-4" />
          {job.location}
        </span>
        <span className="flex items-center gap-1 text-sm">
          <Briefcase className="w-4 h-4" />
          {job.type}
        </span>
      </div>
      <p className="text-[#1e293b]/80 mb-3 md:mb-4 line-clamp-2 text-sm md:text-base">{job.description}</p>
      <div className="space-y-1 md:space-y-2">
        <p className="text-xs md:text-sm text-[#1e293b]/70">Senioridade: {job.seniority}</p>
        <p className="text-xs md:text-sm text-[#1e293b]/70">Faixa Salarial: {job.salary_range}</p>
        <p className="text-xs md:text-sm text-[#1e293b]/70">Contratação: {job.contract_type}</p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            className="w-full mt-4 bg-[#7779f5] hover:bg-[#9b87f5] text-white transition-colors text-sm md:text-base"
          >
            Ver vaga
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95%] md:max-w-2xl p-4 md:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold text-[#1e293b]">{job.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="font-semibold text-[#1e293b] text-sm md:text-base">Empresa</h4>
              <p className="text-[#1e293b]/80 text-sm md:text-base">{job.company}</p>
            </div>
            <div>
              <h4 className="font-semibold text-[#1e293b] text-sm md:text-base">Localização</h4>
              <p className="text-[#1e293b]/80 text-sm md:text-base">{job.location}</p>
            </div>
            <div>
              <h4 className="font-semibold text-[#1e293b] text-sm md:text-base">Tipo de Trabalho</h4>
              <p className="text-[#1e293b]/80 text-sm md:text-base">{job.type}</p>
            </div>
            <div>
              <h4 className="font-semibold text-[#1e293b] text-sm md:text-base">Descrição</h4>
              <p className="text-[#1e293b]/80 text-sm md:text-base">{job.description}</p>
            </div>
            <div>
              <h4 className="font-semibold text-[#1e293b] text-sm md:text-base">Senioridade</h4>
              <p className="text-[#1e293b]/80 text-sm md:text-base">{job.seniority}</p>
            </div>
            <div>
              <h4 className="font-semibold text-[#1e293b] text-sm md:text-base">Faixa Salarial</h4>
              <p className="text-[#1e293b]/80 text-sm md:text-base">{job.salary_range}</p>
            </div>
            <div>
              <h4 className="font-semibold text-[#1e293b] text-sm md:text-base">Tipo de Contratação</h4>
              <p className="text-[#1e293b]/80 text-sm md:text-base">{job.contract_type}</p>
            </div>
            <a 
              href={job.application_url || "https://example.com/apply"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block mt-6"
            >
              <Button 
                className="w-full bg-[#7779f5] hover:bg-[#9b87f5] text-white transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
              >
                Candidatar-se <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}