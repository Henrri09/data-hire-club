import { Briefcase, MapPin } from "lucide-react";

interface JobCardHeaderProps {
  job: {
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

export function JobCardHeader({ job }: JobCardHeaderProps) {
  // Função para formatar a faixa salarial
  const formatSalaryRange = (salary: string) => {
    if (!salary || salary.toLowerCase() === 'a combinar') return 'A combinar';
    
    // Remove caracteres não numéricos e divide por hífen
    const parts = salary.split('-').map(part => {
      const number = part.replace(/[^\d]/g, '');
      if (!number) return 'A combinar';
      return `R$ ${Number(number).toLocaleString('pt-BR')}`;
    });

    return parts.join(' - ');
  };

  return (
    <>
      <h3 className="text-lg md:text-xl font-semibold mb-2 text-[#1e293b]">{job.title}</h3>
      <p className="text-[#1e293b]/80 mb-3 md:mb-4">{job.company}</p>
      <div className="flex flex-wrap gap-3 md:gap-4 text-[#1e293b]/70 mb-3 md:mb-4">
        <span className="flex items-center gap-1 text-sm">
          <MapPin className="w-4 h-4" />
          {job.location.toUpperCase()}
        </span>
        <span className="flex items-center gap-1 text-sm">
          <Briefcase className="w-4 h-4" />
          {job.type}
        </span>
      </div>
      <p className="text-[#1e293b]/80 mb-3 md:mb-4 line-clamp-2 text-sm md:text-base">
        {job.description}
      </p>
      <div className="space-y-1 md:space-y-2">
        <p className="text-xs md:text-sm text-[#1e293b]/70">Senioridade: {job.seniority}</p>
        <p className="text-xs md:text-sm text-[#1e293b]/70">Faixa Salarial: {formatSalaryRange(job.salary_range)}</p>
        <p className="text-xs md:text-sm text-[#1e293b]/70">Contratação: {job.contract_type}</p>
      </div>
    </>
  );
}