import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormFields } from "./job-form/FormFields";
import { FormActions } from "./job-form/FormActions";

interface JobPostingFormProps {
  formData: {
    titulo: string;
    descricao: string;
    local: string;
    senioridade: string;
    tipoContratacao: string;
    faixaSalarialMin: string;
    faixaSalarialMax: string;
    linkExterno: string;
  };
  handleInputChange: (field: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function JobPostingForm({ 
  formData, 
  handleInputChange, 
  handleSubmit, 
  onCancel,
  isSubmitting = false 
}: JobPostingFormProps) {
  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-4 w-full max-h-[80vh] overflow-y-auto px-1"
    >
      <DialogHeader>
        <DialogTitle>Publicar Nova Vaga</DialogTitle>
      </DialogHeader>
      
      <FormFields 
        formData={formData}
        handleInputChange={handleInputChange}
      />

      <DialogFooter>
        <FormActions 
          onCancel={onCancel}
          isSubmitting={isSubmitting}
        />
      </DialogFooter>
    </form>
  );
}