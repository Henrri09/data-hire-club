import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export default function CompanyRegister() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-lg mx-auto">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl md:text-3xl text-center">Cadastro Empresarial</CardTitle>
            <CardDescription className="text-center">
              Cadastre sua empresa para começar a publicar vagas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nome da Empresa</Label>
                  <Input id="companyName" placeholder="Nome da empresa" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responsibleName">Nome do Responsável</Label>
                  <Input id="responsibleName" placeholder="Nome completo" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" placeholder="empresa@email.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" type="password" placeholder="••••••••" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirme a Senha</Label>
                  <Input id="confirmPassword" type="password" placeholder="••••••••" required />
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#7779f5] hover:bg-[#7779f5]/90">
                Cadastrar Empresa
              </Button>
              <p className="text-center text-sm text-gray-600">
                Já tem uma conta?{" "}
                <Link to="/company/login" className="text-[#7779f5] hover:underline">
                  Faça login
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}