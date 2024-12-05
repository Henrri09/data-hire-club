import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export default function CompanyLogin() {
  return (
    <div className="container mx-auto px-4 py-24">
      <Card className="max-w-md mx-auto">
        <CardHeader>
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
            <Button type="submit" className="w-full">
              Entrar
            </Button>
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{" "}
                <Link to="/company/register" className="text-primary hover:underline">
                  Cadastre sua empresa
                </Link>
              </p>
              <Link to="/company/forgot-password" className="text-sm text-primary hover:underline block">
                Esqueceu sua senha?
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}