import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

export function FilterButton({ label, isActive, onClick, icon }: FilterButtonProps) {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className={cn(
        "transition-all duration-200 hover:scale-105",
        isActive 
          ? "bg-primary text-primary-foreground shadow-sm" 
          : "hover:bg-muted"
      )}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </Button>
  );
}