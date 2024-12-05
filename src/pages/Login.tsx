import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileHeader } from "@/components/MobileHeader";

export default function Login() {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {isMobile ? (
        <MobileHeader showAuthButtons={false} />
      ) : (
        <Link 
          to="/" 
          className="absolute left-4 top-4 text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar para home
        </Link>
      )}
      
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl md:text-3xl text-center">Entrar</CardTitle>
            <CardDescription className="text-center">
              Entre com sua conta para acessar a plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="seu@email.com" />
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
                  <Link to="/register" className="text-[#7779f5] hover:underline">
                    Cadastre-se
                  </Link>
                </p>
                <Link to="/forgot-password" className="text-sm text-[#7779f5] hover:underline block">
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