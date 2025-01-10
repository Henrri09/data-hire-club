import { useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
    console.log('Field changed:', field, 'New value:', value);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    console.log('Validating form data:', formData);
    
    if (!formData.titulo || !formData.descricao || !formData.linkExterno) {
      console.log('Validation failed: Missing required fields');
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.linkExterno.startsWith('http://') && !formData.linkExterno.startsWith('https://')) {
      console.log('Validation failed: Invalid external link format');
      toast({
        title: "Link inválido",
        description: "O link externo deve começar com http:// ou https://",
        variant: "destructive"
      });
      return false;
    }

    console.log('Form validation passed');
    return true;
  };

  const resetForm = () => {
    console.log('Resetting form');
    setFormData(initialFormData);
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent, onSuccess?: () => void) => {
    console.log('Form submission started');
    e.preventDefault();
    
    if (!user) {
      console.log('Submission failed: No user logged in');
      toast({
        title: "Erro ao publicar vaga",
        description: "Você precisa estar logado para publicar vagas.",
        variant: "destructive"
      });
      return;
    }

    if (!validateForm()) {
      console.log('Submission failed: Form validation failed');
      return;
    }

    try {
      console.log('Setting submitting state');
      setIsSubmitting(true);

      console.log('Preparing job data for submission');
      const jobData = {
        company_id: user.id,
        title: formData.titulo,
        description: formData.descricao,
        location: formData.local,
        experience_level: formData.senioridade,
        contract_type: formData.tipoContratacao,
        salary_range: formData.faixaSalarialMin && formData.faixaSalarialMax 
          ? `${formData.faixaSalarialMin}-${formData.faixaSalarialMax}`
          : null,
        external_link: formData.linkExterno,
        status: 'active',
        job_type: 'full-time',
        work_model: formData.local.toLowerCase().includes('remoto') ? 'remote' : 'on-site'
      };

      console.log('Inserting job data:', jobData);
      const { error: jobError } = await supabase
        .from('jobs')
        .insert(jobData);

      if (jobError) {
        console.error('Error inserting job:', jobError);
        throw jobError;
      }

      console.log('Job posted successfully');
      toast({
        title: "Vaga publicada",
        description: "Sua vaga foi publicada com sucesso!",
      });

      resetForm();
      if (onSuccess) {
        console.log('Calling success callback');
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error posting job:', error);
      toast({
        title: "Erro ao publicar vaga",
        description: error.message || "Ocorreu um erro ao tentar publicar a vaga. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      console.log('Resetting submitting state');
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