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
        form="job-posting-form"
        disabled={isSubmitting}
        className="bg-[#7779f5] hover:bg-[#7779f5]/90 w-full md:w-auto"
      >
        {isSubmitting ? "Publicando..." : "Publicar Vaga"}
      </Button>
    </div>
  );
}