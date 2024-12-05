import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export default function CompanyRegister() {
  return (
    <div className="container mx-auto px-4 py-24">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Cadastro Empresarial</CardTitle>
          <CardDescription>
            Cadastre sua empresa para começar a publicar vagas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <Input id="companyName" placeholder="Nome da empresa" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ (opcional)</Label>
                <Input id="cnpj" placeholder="00.000.000/0000-00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsibleName">Nome do Responsável</Label>
                <Input id="responsibleName" placeholder="Nome completo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail Corporativo</Label>
                <Input id="email" type="email" placeholder="empresa@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sector">Setor de Atuação</Label>
                <Input id="sector" placeholder="Ex: Tecnologia" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
                <Input id="location" placeholder="Cidade, Estado" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirme a Senha</Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Cadastrar Empresa
            </Button>
            <p className="text-center text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link to="/company/login" className="text-primary hover:underline">
                Faça login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}