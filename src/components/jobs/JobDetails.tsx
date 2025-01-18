interface JobDetailsProps {
  job: {
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
  };
}

export function JobDetails({ job }: JobDetailsProps) {
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
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-[#1e293b] text-sm md:text-base">Descrição</h4>
        <p className="text-[#1e293b]/80 text-sm md:text-base whitespace-pre-line">{job.description}</p>
      </div>

      {job.requirements && job.requirements.length > 0 && (
        <div>
          <h4 className="font-semibold text-[#1e293b] text-sm md:text-base">Requisitos</h4>
          <ul className="list-disc list-inside text-[#1e293b]/80 text-sm md:text-base space-y-1">
            {job.requirements.map((req, index) => (
              <li key={index} className="pl-2">{req}</li>
            ))}
          </ul>
        </div>
      )}

      {job.responsibilities && job.responsibilities.length > 0 && (
        <div>
          <h4 className="font-semibold text-[#1e293b] text-sm md:text-base">Responsabilidades</h4>
          <ul className="list-disc list-inside text-[#1e293b]/80 text-sm md:text-base space-y-1">
            {job.responsibilities.map((resp, index) => (
              <li key={index} className="pl-2">{resp}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h4 className="font-semibold text-[#1e293b] text-sm md:text-base">Senioridade</h4>
        <p className="text-[#1e293b]/80 text-sm md:text-base">{job.seniority}</p>
      </div>

      <div>
        <h4 className="font-semibold text-[#1e293b] text-sm md:text-base">Faixa Salarial</h4>
        <p className="text-[#1e293b]/80 text-sm md:text-base">{formatSalaryRange(job.salary_range)}</p>
      </div>

      <div>
        <h4 className="font-semibold text-[#1e293b] text-sm md:text-base">Tipo de Contratação</h4>
        <p className="text-[#1e293b]/80 text-sm md:text-base">{job.contract_type}</p>
      </div>

      {job.benefits && job.benefits.length > 0 && (
        <div>
          <h4 className="font-semibold text-[#1e293b] text-sm md:text-base">Benefícios</h4>
          <ul className="list-disc list-inside text-[#1e293b]/80 text-sm md:text-base space-y-1">
            {job.benefits.map((benefit, index) => (
              <li key={index} className="pl-2">{benefit}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}