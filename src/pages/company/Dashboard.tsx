import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { OverviewTab } from "@/components/company/dashboard/OverviewTab";
import { JobsTab } from "@/components/company/dashboard/JobsTab";
import { ProfileTab } from "@/components/company/dashboard/ProfileTab";

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
    linkExterno: "", // New field for external link
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard Empresarial</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#7779f5] hover:bg-[#7779f5]/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Publicar Nova Vaga
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Publicar Nova Vaga</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título da Vaga</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange("titulo", e.target.value)}
                  placeholder="Ex: Analista de Dados Sênior"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição da Vaga</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange("descricao", e.target.value)}
                  placeholder="Descreva as responsabilidades e requisitos da vaga"
                  className="min-h-[150px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="local">Local</Label>
                <Input
                  id="local"
                  value={formData.local}
                  onChange={(e) => handleInputChange("local", e.target.value)}
                  placeholder="Ex: São Paulo, SP (Remoto)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senioridade">Senioridade</Label>
                  <Select
                    value={formData.senioridade}
                    onValueChange={(value) => handleInputChange("senioridade", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a senioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Júnior</SelectItem>
                      <SelectItem value="pleno">Pleno</SelectItem>
                      <SelectItem value="senior">Sênior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipoContratacao">Tipo de Contratação</Label>
                  <Select
                    value={formData.tipoContratacao}
                    onValueChange={(value) => handleInputChange("tipoContratacao", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clt">CLT</SelectItem>
                      <SelectItem value="pj">PJ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="faixaSalarialMin">Faixa Salarial Mínima</Label>
                  <Input
                    id="faixaSalarialMin"
                    type="number"
                    value={formData.faixaSalarialMin}
                    onChange={(e) => handleInputChange("faixaSalarialMin", e.target.value)}
                    placeholder="Ex: 5000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="faixaSalarialMax">Faixa Salarial Máxima</Label>
                  <Input
                    id="faixaSalarialMax"
                    type="number"
                    value={formData.faixaSalarialMax}
                    onChange={(e) => handleInputChange("faixaSalarialMax", e.target.value)}
                    placeholder="Ex: 7000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkExterno">Link para Candidatura (Obrigatório)</Label>
                <Input
                  id="linkExterno"
                  value={formData.linkExterno}
                  onChange={(e) => handleInputChange("linkExterno", e.target.value)}
                  placeholder="Ex: https://empresa.com/vagas/analista"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="bg-[#7779f5] hover:bg-[#7779f5]/90"
                >
                  Publicar Vaga
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-[#7779f5]/10">
          <TabsTrigger 
            value="overview"
            className="data-[state=active]:bg-[#7779f5] data-[state=active]:text-white"
          >
            Visão Geral
          </TabsTrigger>
          <TabsTrigger 
            value="jobs"
            className="data-[state=active]:bg-[#7779f5] data-[state=active]:text-white"
          >
            Minhas Vagas
          </TabsTrigger>
          <TabsTrigger 
            value="profile"
            className="data-[state=active]:bg-[#7779f5] data-[state=active]:text-white"
          >
            Perfil da Empresa
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="jobs">
          <JobsTab />
        </TabsContent>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}