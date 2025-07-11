import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

export default function CompanyLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Verificar se o erro é de email não confirmado
        if (authError.message.includes('Email not confirmed')) {
          toast.error("Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.");
          return;
        }
        throw authError;
      }

      // Verificar se o usuário é uma empresa
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', authData.user.id)
        .maybeSingle();

      console.log('Profile data:', profileData);

      if (profileError) throw profileError;

      if (!profileData) {
        await supabase.auth.signOut();
        throw new Error('Perfil não encontrado. Por favor, registre-se primeiro.');
      }

      if (profileData.user_type !== 'company') {
        await supabase.auth.signOut();
        throw new Error('Esta conta não é uma conta empresarial');
      }

      toast.success("Login realizado com sucesso!");
      navigate('/company/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || "Erro ao realizar login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 md:bg-transparent flex flex-col md:flex-row">

      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] p-12 text-white flex-col justify-center">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold mb-6">Data Hire Club</h1>
          <p className="text-xl opacity-90">
            Encontre os melhores talentos em dados para sua empresa.
          </p>
        </div>
      </div>

      <div className="flex flex-1 relative items-center justify-center p-6 bg-gray-50">
        <div className="mb-6 absolute top-6 left-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-[#8B5CF6] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para home
          </Link>
        </div>
        <div className="w-full max-w-md space-y-8">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl md:text-3xl text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Entre com sua conta empresarial para publicar vagas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail corporativo</Label>
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
              <Button
                type="submit"
                className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED]"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Não tem uma conta?{" "}
                  <Link to="/register" className="text-[#8B5CF6] hover:underline">
                    Cadastre sua empresa
                  </Link>
                </p>
                <Link to="/company/forgot-password" className="text-sm text-[#8B5CF6] hover:underline block">
                  Esqueceu sua senha?
                </Link>
              </div>
            </form>
          </CardContent>
        </div>
      </div>
    </div>
  );
}