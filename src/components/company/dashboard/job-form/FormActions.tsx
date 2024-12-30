import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
}

export function FormActions({ onCancel, isSubmitting }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-4 mt-6">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel} 
        disabled={isSubmitting}
        className="w-full md:w-auto"
      >
        Cancelar
      </Button>
      <Button 
        type="submit" 
        className="bg-[#7779f5] hover:bg-[#7779f5]/90 w-full md:w-auto"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Publicando..." : "Publicar Vaga"}
      </Button>
    </div>
  );
}