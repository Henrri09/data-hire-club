import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, MoreVertical, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { JobPostingForm } from "./JobPostingForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Job {
  id: string;
  title: string;
  status: string;
  applications_count: number;
}

export function JobsTab() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  // Changed from useState to useEffect
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('id, title, status, applications_count')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching jobs:', error);
      return;
    }

    setJobs(jobs || []);
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
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
  };

  const handleDelete = async (jobId: string) => {
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
  };

  const handleEditSubmit = async (formData: any) => {
    if (!selectedJob) return;

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
      .eq('id', selectedJob.id);

    if (error) {
      toast({
        title: "Erro ao atualizar vaga",
        description: "Não foi possível atualizar a vaga.",
        variant: "destructive",
      });
      return;
    }

    setIsEditDialogOpen(false);
    fetchJobs();
    toast({
      title: "Vaga atualizada",
      description: "A vaga foi atualizada com sucesso.",
    });
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
            <div key={job.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-gray-600">
                    {job.applications_count} candidatura{job.applications_count !== 1 ? 's' : ''}
                  </p>
                  <span className={`text-sm ${
                    job.status === 'active' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {job.status === 'active' ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Dialog open={isEditDialogOpen && selectedJob?.id === job.id} onOpenChange={(open) => {
                      setIsEditDialogOpen(open);
                      if (!open) setSelectedJob(null);
                    }}>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => {
                          e.preventDefault();
                          setSelectedJob(job);
                          setIsEditDialogOpen(true);
                        }}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Vaga</DialogTitle>
                        </DialogHeader>
                        <JobPostingForm
                          formData={{
                            titulo: job.title,
                            descricao: "",
                            local: "",
                            senioridade: "",
                            tipoContratacao: "",
                            faixaSalarialMin: "",
                            faixaSalarialMax: "",
                            linkExterno: "",
                          }}
                          handleInputChange={() => {}}
                          handleSubmit={handleEditSubmit}
                          onCancel={() => setIsEditDialogOpen(false)}
                        />
                      </DialogContent>
                    </Dialog>
                    
                    <DropdownMenuItem onSelect={() => handleStatusChange(job.id, job.status === 'active' ? 'inactive' : 'active')}>
                      {job.status === 'active' ? 'Desativar' : 'Ativar'}
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      className="text-red-600"
                      onSelect={() => handleDelete(job.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}