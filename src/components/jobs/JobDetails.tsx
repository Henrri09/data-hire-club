interface JobDetailsProps {
  job: {
    description: string;
    requirements?: string[];
    responsibilities?: string[];
    seniority: string;
    salary_range: string;
    contract_type: string;
    benefits?: string[];
    location?: string;
  };
}

export function JobDetails({ job }: JobDetailsProps) {
  return (
    <div className="space-y-6">
      {job.location && (
        <div>
          <h3 className="text-sm font-semibold text-[#1e293b] mb-2">Localização</h3>
          <p className="text-sm text-[#64748b]">{job.location}</p>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-[#1e293b] mb-2">Descrição</h3>
        <p className="text-sm text-[#64748b] whitespace-pre-wrap">{job.description}</p>
      </div>

      {job.requirements && job.requirements.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[#1e293b] mb-2">Requisitos</h3>
          <ul className="list-disc list-inside text-sm text-[#64748b] space-y-1">
            {job.requirements.map((requirement, index) => (
              <li key={index}>{requirement}</li>
            ))}
          </ul>
        </div>
      )}

      {job.responsibilities && job.responsibilities.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[#1e293b] mb-2">Responsabilidades</h3>
          <ul className="list-disc list-inside text-sm text-[#64748b] space-y-1">
            {job.responsibilities.map((responsibility, index) => (
              <li key={index}>{responsibility}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-semibold text-[#1e293b] mb-2">Senioridade</h3>
          <p className="text-sm text-[#64748b]">{job.seniority}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[#1e293b] mb-2">Faixa Salarial</h3>
          <p className="text-sm text-[#64748b]">{job.salary_range}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[#1e293b] mb-2">Tipo de Contratação</h3>
          <p className="text-sm text-[#64748b]">{job.contract_type}</p>
        </div>
      </div>

      {job.benefits && job.benefits.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[#1e293b] mb-2">Benefícios</h3>
          <ul className="list-disc list-inside text-sm text-[#64748b] space-y-1">
            {job.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}