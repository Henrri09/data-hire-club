import { useState, useCallback } from "react";
import supabase from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Job } from "@/types/jobs.types";
import { Database } from "@/integrations/supabase/types";

type JobType = Database['public']['Enums']['job_type'];

export const useJobsManagement = (userId: string | undefined) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchJobs = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      console.log('Fetching jobs for company:', userId);

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('company_id', userId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        toast({
          title: "Erro ao carregar vagas",
          description: "Não foi possível carregar suas vagas. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      console.log('Jobs fetched:', data);
      setJobs(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao carregar as vagas. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast]);

  const handleCreateJob = async (formData: any) => {
    try {
      if (!userId) {
        throw new Error('Usuário não identificado');
      }

      const jobData: Database['public']['Tables']['jobs']['Insert'] = {
        company_id: userId,
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
      };

      console.log('Creating job with data:', jobData);

      const { data, error } = await supabase
        .from('jobs')
        .insert([jobData])
        .select()
        .single();

      if (error) {
        console.error('Error creating job:', error);
        throw error;
      }

      console.log('Job created successfully:', data);
      await fetchJobs();

      return { success: true, data };
    } catch (error: any) {
      console.error('Error in handleCreateJob:', error);
      throw error;
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: newStatus })
        .eq('id', jobId);

      if (error) {
        toast({
          title: "Erro ao atualizar status",
          description: "Não foi possível atualizar o status da vaga.",
          variant: "destructive",
        });
        return;
      }

      setJobs(jobs.map(job =>
        job.id === jobId ? { ...job, status: newStatus } : job
      ));

      toast({
        title: "Status atualizado",
        description: `A vaga foi ${newStatus === 'active' ? 'ativada' : 'desativada'} com sucesso.`,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao atualizar o status. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', jobId);

      if (error) {
        toast({
          title: "Erro ao excluir vaga",
          description: "Não foi possível excluir a vaga.",
          variant: "destructive",
        });
        return;
      }

      setJobs(jobs.filter(job => job.id !== jobId));
      toast({
        title: "Vaga excluída",
        description: "A vaga foi excluída com sucesso.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao excluir a vaga. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (formData: any) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({
          title: formData.titulo,
          description: formData.descricao,
          location: formData.local,
          experience_level: formData.senioridade,
          contract_type: formData.tipoContratacao,
          salary_range: formData.faixaSalarialMin && formData.faixaSalarialMax
            ? `${formData.faixaSalarialMin}-${formData.faixaSalarialMax}`
            : null,
          external_link: formData.linkExterno,
        })
        .eq('id', formData.id);

      if (error) {
        toast({
          title: "Erro ao atualizar vaga",
          description: "Não foi possível atualizar a vaga.",
          variant: "destructive",
        });
        return;
      }

      await fetchJobs();
      toast({
        title: "Vaga atualizada",
        description: "A vaga foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao atualizar a vaga. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return {
    jobs,
    isLoading,
    fetchJobs,
    handleStatusChange,
    handleDelete,
    handleEdit,
    handleCreateJob
  };
};