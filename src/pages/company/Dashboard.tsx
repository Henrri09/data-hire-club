import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { OverviewTab } from "@/components/company/dashboard/OverviewTab";
import { JobsTab } from "@/components/company/dashboard/JobsTab";
import { ProfileTab } from "@/components/company/dashboard/ProfileTab";
import { JobPostingForm } from "@/components/company/dashboard/JobPostingForm";
import { CompanyHeader } from "@/components/company/Header";

export default function CompanyDashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isEmpty = Object.values(formData).some((value) => value === "");
    
    if (isEmpty) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (!formData.linkExterno.startsWith('http://') && !formData.linkExterno.startsWith('https://')) {
      toast.error("Por favor, insira um link válido começando com http:// ou https://");
      return;
    }

    console.log("Dados da vaga:", formData);
    toast.success("Vaga publicada com sucesso!");
    setIsDialogOpen(false);
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
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CompanyHeader />
      <div className="container mx-auto px-4 py-6 md:py-8 flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4 md:gap-0">
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard Empresarial</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#7779f5] hover:bg-[#7779f5]/90 w-full md:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Publicar Nova Vaga
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-[95%] p-4 md:p-6">
              <JobPostingForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-[#7779f5]/10 w-full md:w-auto flex overflow-x-auto">
            <TabsTrigger 
              value="overview"
              className="flex-1 md:flex-none data-[state=active]:bg-[#7779f5] data-[state=active]:text-white"
            >
              Visão Geral
            </TabsTrigger>
            <TabsTrigger 
              value="jobs"
              className="flex-1 md:flex-none data-[state=active]:bg-[#7779f5] data-[state=active]:text-white"
            >
              Minhas Vagas
            </TabsTrigger>
            <TabsTrigger 
              value="profile"
              className="flex-1 md:flex-none data-[state=active]:bg-[#7779f5] data-[state=active]:text-white"
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