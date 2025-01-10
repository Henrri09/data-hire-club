import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@supabase/auth-helpers-react";
import { JobListItem } from "./job/JobListItem";
import { useJobsManagement } from "@/hooks/useJobsManagement";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { JobPostingForm } from "./JobPostingForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export function JobsTab() {
  const user = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const itemsPerPage = 5;
  const { toast } = useToast();
  
  const {
    jobs,
    fetchJobs,
    handleStatusChange,
    handleDelete,
    handleEdit,
    isLoading
  } = useJobsManagement(user?.id);

  useEffect(() => {
    if (user?.id) {
      console.log('Fetching jobs for user:', user.id);
      fetchJobs();
    }
  }, [user?.id, fetchJobs]);

  // Calculate pagination values
  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = jobs.slice(startIndex, endIndex);

  const handleCreateJob = async (formData: any) => {
    try {
      if (!user?.id) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para criar uma vaga",
          variant: "destructive",
        });
        return;
      }

      const jobData: Database['public']['Tables']['jobs']['Insert'] = {
        company_id: user.id,
        title: formData.titulo,
        description: formData.descricao,
        location: formData.local,
        experience_level: formData.senioridade,
        contract_type: formData.tipoContratacao,
        salary_range: `${formData.faixaSalarialMin}-${formData.faixaSalarialMax}`,
        external_link: formData.linkExterno,
        status: 'active',
        job_type: 'full-time' as const, // Explicitly type as "full-time"
        work_model: formData.local?.toLowerCase().includes('remoto') ? 'remote' : 'on-site',
        requirements: [],
        responsibilities: [],
        applications_count: 0,
        views_count: 0
      };

      console.log('Attempting to create job with data:', jobData);

      const { error } = await supabase.from('jobs').insert(jobData);

      if (error) {
        console.error('Error creating job:', error);
        toast({
          title: "Erro ao criar vaga",
          description: "Não foi possível criar a vaga. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso!",
        description: "Vaga criada com sucesso",
      });

      setIsDialogOpen(false);
      fetchJobs(); // Refresh the jobs list
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao criar a vaga. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <div>
          <CardTitle>Minhas Vagas</CardTitle>
          <CardDescription>
            Gerencie suas vagas publicadas
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#7779f5] hover:bg-[#7779f5]/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Publicar Nova Vaga
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <JobPostingForm
              formData={{
                titulo: '',
                descricao: '',
                local: '',
                senioridade: '',
                tipoContratacao: '',
                faixaSalarialMin: '',
                faixaSalarialMax: '',
                linkExterno: '',
              }}
              handleInputChange={(field, value) => {
                // This will be handled by the form component
              }}
              handleSubmit={handleCreateJob}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhuma vaga publicada ainda.</p>
              <p className="text-sm mt-2">Clique em "Publicar Nova Vaga" para começar.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {currentJobs.map((job) => (
                  <JobListItem
                    key={job.id}
                    job={job}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}