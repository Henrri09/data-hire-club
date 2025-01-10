import { useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type JobType = Database['public']['Enums']['job_type'];

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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.titulo || !formData.descricao || !formData.linkExterno) {
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

    return true;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro ao publicar vaga",
        description: "Você precisa estar logado para publicar vagas.",
        variant: "destructive"
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

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
        job_type: 'full-time' as JobType,
        work_model: formData.local.toLowerCase().includes('remoto') ? 'remote' : 'on-site',
        requirements: [],
        responsibilities: [],
        applications_count: 0,
        views_count: 0
      };

      const { error: jobError } = await supabase
        .from('jobs')
        .insert(jobData);

      if (jobError) {
        throw jobError;
      }

      toast({
        title: "Vaga publicada",
        description: "Sua vaga foi publicada com sucesso!",
      });

      resetForm();
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