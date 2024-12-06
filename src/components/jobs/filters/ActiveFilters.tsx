import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ActiveFiltersProps {
  filters: string[];
  onClearFilter: (filter: string) => void;
}

export function ActiveFilters({ filters, onClearFilter }: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <Badge 
          key={filter} 
          variant="secondary"
          className="flex items-center gap-1 px-3 py-1"
        >
          {filter}
          <X 
            className="h-3 w-3 cursor-pointer" 
            onClick={() => onClearFilter(filter)}
          />
        </Badge>
      ))}
    </div>
  );
}