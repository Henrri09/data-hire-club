import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { JobListItem } from "./job/JobListItem";
import { useAuth } from "@supabase/auth-helpers-react";

interface Job {
  id: string;
  title: string;
  status: string;
  applications_count: number;
}

export function JobsTab() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data: jobs, error } = await supabase
        .from('jobs')
        .select('id, title, status, applications_count')
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
          company_id: auth?.user?.id,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Minhas Vagas</CardTitle>
        <CardDescription>
          Gerencie suas vagas publicadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobListItem
              key={job.id}
              job={job}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}