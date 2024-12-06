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
  };
}

export function JobDetails({ job }: JobDetailsProps) {
  return (
    <div className="space-y-4">
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
    </div>
  );
}