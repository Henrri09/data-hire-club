import { Database, BarChart3, Code, Brain } from "lucide-react";
import { FilterButton } from "./FilterButton";

interface DataAreaTagsProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

const dataTags = [
  { label: "Data Analyst", value: "data-analyst", icon: <BarChart3 className="h-3 w-3" /> },
  { label: "Data Scientist", value: "data-scientist", icon: <Brain className="h-3 w-3" /> },
  { label: "Data Engineer", value: "data-engineer", icon: <Database className="h-3 w-3" /> },
  { label: "BI", value: "bi", icon: <BarChart3 className="h-3 w-3" /> },
  { label: "Python", value: "python", icon: <Code className="h-3 w-3" /> },
  { label: "SQL", value: "sql", icon: <Database className="h-3 w-3" /> },
  { label: "Machine Learning", value: "ml", icon: <Brain className="h-3 w-3" /> },
  { label: "ETL", value: "etl", icon: <Database className="h-3 w-3" /> },
];

export function DataAreaTags({ selectedTags, onTagToggle }: DataAreaTagsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Database className="h-4 w-4" />
        Área de Dados
      </h3>
      <div className="flex flex-wrap gap-2">
        {dataTags.map((tag) => (
          <FilterButton
            key={tag.value}
            label={tag.label}
            isActive={selectedTags.includes(tag.value)}
            onClick={() => onTagToggle(tag.value)}
            icon={tag.icon}
          />
        ))}
      </div>
    </div>
  );
}