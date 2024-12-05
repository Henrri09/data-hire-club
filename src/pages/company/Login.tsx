import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export default function CompanyLogin() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl md:text-3xl text-center">Login Empresarial</CardTitle>
            <CardDescription className="text-center">
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
    </div>
  );
}