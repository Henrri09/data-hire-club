import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { OverviewTab } from "@/components/company/dashboard/OverviewTab";
import { JobsTab } from "@/components/company/dashboard/JobsTab";
import { ProfileTab } from "@/components/company/dashboard/ProfileTab";
import { JobPostingForm } from "@/components/company/dashboard/JobPostingForm";
import { CompanyHeader } from "@/components/company/Header";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function CompanyDashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const user = useUser();

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    local: "",
    senioridade: "",
    tipoContratacao: "",
    faixaSalarialMin: "",
    faixaSalarialMax: "",
    linkExterno: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          company_id: user.id,
          title: formData.titulo,
          description: formData.descricao,
          location: formData.local,
          experience_level: formData.senioridade,
          contract_type: formData.tipoContratacao,
          salary_range: `${formData.faixaSalarialMin}-${formData.faixaSalarialMax}`,
          external_link: formData.linkExterno,
          status: 'active',
          job_type: 'full-time'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Vaga publicada",
        description: "Sua vaga foi publicada com sucesso!",
      });

      // Limpa o formulário e fecha o dialog
      setFormData({
        titulo: "",
        descricao: "",
        local: "",
        senioridade: "",
        tipoContratacao: "",
        faixaSalarialMin: "",
        faixaSalarialMax: "",
        linkExterno: "",
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao publicar vaga:', error);
      toast({
        title: "Erro ao publicar vaga",
        description: "Ocorreu um erro ao tentar publicar a vaga. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CompanyHeader />
      <div className="container mx-auto px-4 py-6 md:py-8 flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4 md:gap-0">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Dashboard Empresarial</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#7779f5] hover:bg-[#7779f5]/90 w-full md:w-auto text-sm md:text-base">
                <PlusCircle className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                Publicar Nova Vaga
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-[95%] p-4 md:p-6">
              <JobPostingForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                onCancel={() => setIsDialogOpen(false)}
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-[#7779f5]/10 inline-flex w-auto">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-[#7779f5] data-[state=active]:text-white whitespace-nowrap text-xs md:text-sm"
            >
              Visão Geral
            </TabsTrigger>
            <TabsTrigger 
              value="jobs"
              className="data-[state=active]:bg-[#7779f5] data-[state=active]:text-white whitespace-nowrap text-xs md:text-sm"
            >
              Minhas Vagas
            </TabsTrigger>
            <TabsTrigger 
              value="profile"
              className="data-[state=active]:bg-[#7779f5] data-[state=active]:text-white whitespace-nowrap text-xs md:text-sm"
            >
              Perfil da Empresa
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="jobs" className="mt-6">
            <JobsTab />
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <ProfileTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}