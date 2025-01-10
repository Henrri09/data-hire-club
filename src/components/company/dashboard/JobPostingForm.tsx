import { DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FormFields } from "./job-form/FormFields";
import { FormActions } from "./job-form/FormActions";
import { useState } from "react";

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
  handleSubmit: (formData: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function JobPostingForm({ 
  formData: initialFormData, 
  handleSubmit, 
  onCancel,
  isSubmitting = false 
}: JobPostingFormProps) {
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submit triggered in JobPostingForm');
    await handleSubmit(formData);
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