import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function CompanyLogin() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Gradient Section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] p-12 text-white flex-col justify-center">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold mb-6">Data Talent Bridge para Empresas</h1>
          <p className="text-2xl mb-8">Portal Empresarial</p>
          <p className="text-xl opacity-90">
            Encontre os melhores talentos em dados para sua empresa.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <Card className="w-full max-w-md border-none shadow-none bg-transparent">
          <div className="mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center text-sm text-gray-600 hover:text-[#8B5CF6] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para home
            </Link>
          </div>
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
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="empresa@email.com"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  className="bg-white"
                />
              </div>
              <Button type="submit" className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED]">
                Entrar
              </Button>
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Não tem uma conta?{" "}
                  <Link to="/company/register" className="text-[#8B5CF6] hover:underline">
                    Cadastre sua empresa
                  </Link>
                </p>
                <Link to="/company/forgot-password" className="text-sm text-[#8B5CF6] hover:underline block">
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