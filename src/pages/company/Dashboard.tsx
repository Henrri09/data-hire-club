import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, PlusCircle, Settings, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

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
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar se todos os campos estão preenchidos
    const isEmpty = Object.values(formData).some((value) => value === "");
    
    if (isEmpty) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    // Aqui você adicionaria a lógica para salvar a vaga
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
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard Empresarial</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
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

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Publicar Vaga</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="jobs">Minhas Vagas</TabsTrigger>
          <TabsTrigger value="profile">Perfil da Empresa</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vagas Ativas</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Candidaturas</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">145</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>Minhas Vagas</CardTitle>
              <CardDescription>
                Gerencie suas vagas publicadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Lista de vagas aqui */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold">Analista de Dados Sênior</h3>
                  <p className="text-sm text-gray-600">4 candidaturas</p>
                  <div className="mt-2 flex gap-2">
                    <Button variant="outline" size="sm">Editar</Button>
                    <Button variant="outline" size="sm">Ver Candidatos</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Perfil da Empresa</CardTitle>
              <CardDescription>
                Gerencie as informações da sua empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editCompanyName">Nome da Empresa</Label>
                    <Input id="editCompanyName" defaultValue="TechBR Solutions" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editCnpj">CNPJ</Label>
                    <Input id="editCnpj" defaultValue="00.000.000/0000-00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editSector">Setor</Label>
                    <Input id="editSector" defaultValue="Tecnologia" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editLocation">Localização</Label>
                    <Input id="editLocation" defaultValue="São Paulo, SP" />
                  </div>
                </div>
                <Button type="submit">Salvar Alterações</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}