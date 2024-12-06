import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface JobFiltersProps {
  selectedType: string;
  selectedSeniority: string;
  selectedContract: string;
  uniqueTypes: string[];
  uniqueSeniorities: string[];
  uniqueContracts: string[];
  onTypeChange: (value: string) => void;
  onSeniorityChange: (value: string) => void;
  onContractChange: (value: string) => void;
}

export function JobFilters({
  selectedType,
  selectedSeniority,
  selectedContract,
  uniqueTypes,
  uniqueSeniorities,
  uniqueContracts,
  onTypeChange,
  onSeniorityChange,
  onContractChange,
}: JobFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow-sm">
      <div className="space-y-2">
        <Label>Tipo de Trabalho</Label>
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {uniqueTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Senioridade</Label>
        <Select value={selectedSeniority} onValueChange={onSeniorityChange}>
          <SelectTrigger>
            <SelectValue placeholder="Todas as senioridades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as senioridades</SelectItem>
            {uniqueSeniorities.map(seniority => (
              <SelectItem key={seniority} value={seniority}>{seniority}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Tipo de Contrato</Label>
        <Select value={selectedContract} onValueChange={onContractChange}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os contratos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os contratos</SelectItem>
            {uniqueContracts.map(contract => (
              <SelectItem key={contract} value={contract}>{contract}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}