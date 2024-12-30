import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Job } from "@/types/jobs.types";

export const useJobsManagement = (userId: string | undefined) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchJobs = async () => {
    try {
      const { data: jobs, error } = await supabase
        .from('jobs')
        .select('id, title, status, applications_count')
        .eq('company_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        return;
      }

      setJobs(jobs || []);
    } catch (error) {
      console.error('Error:', error);
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
        description: "O status da vaga foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Error:', error);
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
    }
  };

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          company_id: userId,
          title: formData.titulo,
          description: formData.descricao,
          location: formData.local,
          experience_level: formData.senioridade,
          contract_type: formData.tipoContratacao,
          salary_range: `${formData.faixaSalarialMin} - ${formData.faixaSalarialMax}`,
          external_link: formData.linkExterno,
          status: 'active',
          job_type: 'full-time'
        })
        .select()
        .single();

      if (error) {
        toast({
          title: "Erro ao publicar vaga",
          description: "Não foi possível publicar a vaga. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Vaga publicada",
        description: "A vaga foi publicada com sucesso!",
      });

      await fetchJobs();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro ao publicar vaga",
        description: "Ocorreu um erro ao publicar a vaga. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
          salary_range: `${formData.faixaSalarialMin} - ${formData.faixaSalarialMax}`,
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

      fetchJobs();
      toast({
        title: "Vaga atualizada",
        description: "A vaga foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return {
    jobs,
    isLoading,
    fetchJobs,
    handleStatusChange,
    handleDelete,
    handleSubmit,
    handleEdit
  };
};