import { Briefcase, MapPin, Building } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

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
    logo_url?: string;
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

  // Função para formatar a localização
  const formatLocation = (location: string) => {
    if (!location) return 'Localização não especificada';
    
    const lowercaseLocation = location.toLowerCase();
    if (lowercaseLocation.includes('remoto') || lowercaseLocation.includes('remote')) {
      return '🌐 Remoto';
    }
    return location;
  };

  // Função para gerar iniciais da empresa
  const getCompanyInitials = (companyName: string) => {
    return companyName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <h3 className="text-lg md:text-xl font-semibold mb-2 text-[#1e293b]">{job.title}</h3>
      
      <div className="flex items-center gap-3 mb-3 md:mb-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={job.logo_url || undefined} alt={`${job.company} logo`} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {job.logo_url ? <Building className="h-5 w-5" /> : getCompanyInitials(job.company)}
          </AvatarFallback>
        </Avatar>
        <p className="text-[#1e293b]/80 font-medium">{job.company}</p>
      </div>
      <div className="flex flex-wrap gap-3 md:gap-4 text-[#1e293b]/70 mb-3 md:mb-4">
        <span className="flex items-center gap-1 text-sm">
          <MapPin className="w-4 h-4" />
          {formatLocation(job.location)}
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