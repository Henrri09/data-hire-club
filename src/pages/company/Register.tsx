import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function CompanyRegister() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const companyName = formData.get('companyName') as string;
    const responsibleName = formData.get('responsibleName') as string;

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro na validação",
        description: "As senhas não coincidem",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: 'company',
            company_name: companyName,
            full_name: responsibleName,
          },
          emailRedirectTo: `${window.location.origin}/company/login`,
        },
      });

      if (error) throw error;

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Enviamos um email de confirmação para o seu endereço. Por favor, verifique sua caixa de entrada para ativar sua conta.",
      });
      
      navigate('/company/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: error.message || "Erro ao realizar registro",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Gradient Section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] p-12 text-white flex-col justify-center">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold mb-6">Data Hire Club para Empresas</h1>
          <p className="text-xl opacity-90">
            Cadastre sua empresa e encontre os melhores talentos em dados.
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
            <CardTitle className="text-2xl md:text-3xl text-center">Cadastro Empresarial</CardTitle>
            <CardDescription className="text-center">
              Cadastre sua empresa para começar a publicar vagas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <Input 
                  id="companyName" 
                  name="companyName"
                  placeholder="Nome da empresa" 
                  className="bg-white"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsibleName">Nome do Responsável</Label>
                <Input 
                  id="responsibleName" 
                  name="responsibleName"
                  placeholder="Nome completo" 
                  className="bg-white"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="empresa@email.com" 
                  className="bg-white"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  placeholder="••••••••" 
                  className="bg-white"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirme a Senha</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword"
                  type="password" 
                  placeholder="••••••••" 
                  className="bg-white"
                  required 
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED]"
                disabled={isLoading}
              >
                {isLoading ? "Cadastrando..." : "Cadastrar Empresa"}
              </Button>
              <p className="text-center text-sm text-gray-600">
                Já tem uma conta?{" "}
                <Link to="/company/login" className="text-[#8B5CF6] hover:underline">
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