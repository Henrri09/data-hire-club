import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, PlusCircle, Settings, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

export default function CompanyDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard Empresarial</h1>
        <Button asChild>
          <Link to="/company/jobs/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Publicar Nova Vaga
          </Link>
        </Button>
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