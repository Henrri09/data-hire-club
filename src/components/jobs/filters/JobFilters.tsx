import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface JobFiltersProps {
  selectedLocation: string;
  selectedType: string;
  selectedSeniority: string;
  selectedContract: string;
  uniqueLocations: string[];
  uniqueTypes: string[];
  uniqueSeniorities: string[];
  uniqueContracts: string[];
  onLocationChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onSeniorityChange: (value: string) => void;
  onContractChange: (value: string) => void;
}

export function JobFilters({
  selectedLocation,
  selectedType,
  selectedSeniority,
  selectedContract,
  uniqueLocations,
  uniqueTypes,
  uniqueSeniorities,
  uniqueContracts,
  onLocationChange,
  onTypeChange,
  onSeniorityChange,
  onContractChange,
}: JobFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-lg shadow-sm">
      <div className="space-y-2">
        <Label>Localização</Label>
        <Select value={selectedLocation} onValueChange={onLocationChange}>
          <SelectTrigger>
            <SelectValue placeholder="Todas as localizações" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as localizações</SelectItem>
            {uniqueLocations.map(location => (
              <SelectItem key={location} value={location}>{location}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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