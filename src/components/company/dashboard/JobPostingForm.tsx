import { DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  const onSubmit = async (e: React.FormEvent) => {
    console.log('Form submit triggered in JobPostingForm');
    e.preventDefault();
    await handleSubmit(e);
    onCancel(); // Fecha o diálogo após o submit
  };

  return (
    <form 
      onSubmit={onSubmit} 
      className="space-y-4 w-full max-h-[80vh] overflow-y-auto px-1"
    >
      <DialogHeader>
        <DialogTitle>Publicar Nova Vaga</DialogTitle>
        <DialogDescription>
          Preencha os campos abaixo para publicar uma nova vaga. Os campos marcados com * são obrigatórios.
        </DialogDescription>
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