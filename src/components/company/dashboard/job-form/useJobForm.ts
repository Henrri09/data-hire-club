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
    
    if (!user) {
      console.error('No user found');
      toast({
        title: "Erro ao publicar vaga",
        description: "Você precisa estar logado para publicar vagas.",
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
      console.log('Creating job with user ID:', user.id);

      const jobData = {
        company_id: user.id,
        title: formData.titulo,
        description: formData.descricao,
        location: formData.local || null,
        experience_level: formData.senioridade || null,
        contract_type: formData.tipoContratacao || null,
        salary_range: formData.faixaSalarialMin && formData.faixaSalarialMax 
          ? `${formData.faixaSalarialMin}-${formData.faixaSalarialMax}`
          : null,
        external_link: formData.linkExterno,
        status: 'active',
        job_type: 'full-time' as JobType,
        work_model: formData.local?.toLowerCase().includes('remoto') ? 'remote' : 'on-site',
        requirements: [],
        responsibilities: [],
        applications_count: 0,
        views_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
        benefits: null,
        career: null,
        max_applications: null,
        skills_required: []
      };

      console.log('Job data to be inserted:', jobData);

      const { data, error: jobError } = await supabase
        .from('jobs')
        .insert([jobData])
        .select()
        .single();

      if (jobError) {
        console.error('Error creating job:', jobError);
        throw jobError;
      }

      console.log('Job created successfully:', data);

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