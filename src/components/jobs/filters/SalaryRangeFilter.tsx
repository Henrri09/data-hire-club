import { DollarSign } from "lucide-react";
import { FilterButton } from "./FilterButton";

interface SalaryRangeFilterProps {
  selectedRanges: string[];
  onRangeToggle: (range: string) => void;
}

const salaryRanges = [
  { label: "Até R$ 3k", value: "0-3000" },
  { label: "R$ 3k - 6k", value: "3000-6000" },
  { label: "R$ 6k - 10k", value: "6000-10000" },
  { label: "R$ 10k+", value: "10000+" },
];

export function SalaryRangeFilter({ selectedRanges, onRangeToggle }: SalaryRangeFilterProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <DollarSign className="h-4 w-4" />
        Faixa Salarial
      </h3>
      <div className="flex flex-wrap gap-2">
        {salaryRanges.map((range) => (
          <FilterButton
            key={range.value}
            label={range.label}
            isActive={selectedRanges.includes(range.value)}
            onClick={() => onRangeToggle(range.value)}
          />
        ))}
      </div>
    </div>
  );
}