import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.descricao || !formData.linkExterno) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.linkExterno.startsWith('http://') && !formData.linkExterno.startsWith('https://')) {
      toast({
        title: "Link inválido",
        description: "O link externo deve começar com http:// ou https://",
        variant: "destructive",
      });
      return;
    }

    console.log('Submitting form with data:', formData);
    await handleSubmit(e);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 w-full max-h-[80vh] overflow-y-auto px-1">
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