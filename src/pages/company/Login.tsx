import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function CompanyLogin() {
  return (
    <div className="container mx-auto px-4 py-24">
      <Card className="max-w-md mx-auto relative">
        <Link 
          to="/" 
          className="absolute left-4 top-4 text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar para home
        </Link>
        <CardHeader className="pt-12">
          <CardTitle>Login Empresarial</CardTitle>
          <CardDescription>
            Entre com sua conta empresarial para publicar vagas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail corporativo</Label>
              <Input id="email" type="email" placeholder="empresa@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full bg-[#7779f5] hover:bg-[#7779f5]/90">
              Entrar
            </Button>
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{" "}
                <Link to="/company/register" className="text-[#7779f5] hover:underline">
                  Cadastre sua empresa
                </Link>
              </p>
              <Link to="/company/forgot-password" className="text-sm text-[#7779f5] hover:underline block">
                Esqueceu sua senha?
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}