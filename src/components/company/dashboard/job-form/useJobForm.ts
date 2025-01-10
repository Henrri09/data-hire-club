import { useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { useJobsManagement } from '@/hooks/useJobsManagement';

interface JobFormData {
  titulo: string;
  descricao: string;
  local: string;
  senioridade: string;
  tipoContratacao: string;
  faixaSalarialMin: string;
  faixaSalarialMax: string;
  linkExterno: string;
}

export function useJobForm() {
  const { toast } = useToast();
  const user = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleCreateJob } = useJobsManagement(user?.id);

  const initialFormData: JobFormData = {
    titulo: "",
    descricao: "",
    local: "",
    senioridade: "",
    tipoContratacao: "",
    faixaSalarialMin: "",
    faixaSalarialMax: "",
    linkExterno: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = ['titulo', 'descricao', 'linkExterno'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof JobFormData]);

    if (missingFields.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.linkExterno.startsWith('http://') && !formData.linkExterno.startsWith('https://')) {
      toast({
        title: "Link inválido",
        description: "O link externo deve começar com http:// ou https://",
        variant: "destructive"
      });
      return false;
    }

    if (formData.faixaSalarialMin && formData.faixaSalarialMax) {
      const min = parseFloat(formData.faixaSalarialMin);
      const max = parseFloat(formData.faixaSalarialMax);
      if (min > max) {
        toast({
          title: "Faixa salarial inválida",
          description: "O valor mínimo não pode ser maior que o valor máximo",
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started');
    
    if (!user?.id) {
      console.error('No user found - user ID:', user?.id);
      toast({
        title: "Erro ao publicar vaga",
        description: "Erro ao identificar sua empresa. Por favor, tente novamente.",
        variant: "destructive"
      });
      return;
    }

    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Creating job with form data:', formData);

      const result = await handleCreateJob(formData);

      if (result.success) {
        toast({
          title: "Vaga publicada",
          description: "Sua vaga foi publicada com sucesso!",
        });
        resetForm();
      }
    } catch (error: any) {
      console.error('Error posting job:', error);
      toast({
        title: "Erro ao publicar vaga",
        description: error.message || "Ocorreu um erro ao tentar publicar a vaga. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    resetForm
  };
}