import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Gradient Section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] p-12 text-white flex-col justify-center">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold mb-6">Data Talent Bridge</h1>
          <p className="text-2xl mb-8">Conectando talentos e oportunidades no mundo dos dados.</p>
          <p className="text-xl opacity-90">
            Faça parte da maior comunidade de profissionais de dados do Brasil.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <Card className="w-full max-w-md border-none shadow-none bg-transparent">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl md:text-3xl text-center">Bem-vindo de volta</CardTitle>
            <CardDescription className="text-center">
              Entre com sua conta para acessar a plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu@email.com"
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
                  <Link to="/register" className="text-[#8B5CF6] hover:underline">
                    Cadastre-se
                  </Link>
                </p>
                <Link to="/forgot-password" className="text-sm text-[#8B5CF6] hover:underline block">
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