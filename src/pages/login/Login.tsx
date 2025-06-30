import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import supabase from "@/integrations/supabase/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user }, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      if (user) {
        // Verificar se o perfil está completo
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, user_type')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        if (!profile.full_name) {
          navigate('/complete-profile');
          return;
        }

        console.log('Profile:', profile);

        // Redirecionar baseado no tipo de usuário
        if (profile.user_type === 'candidate') {
          navigate('/candidate/dashboard');
        } else if (profile.user_type === 'company') {
          navigate('/company/dashboard');
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 md:bg-transparent flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] p-12 text-white flex-col justify-center">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold mb-6">Bem-vindo de volta</h1>
          <p className="text-2xl mb-8">
            Entre para acessar as melhores oportunidades em dados.
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
          <div className="text-center">
            <h2 className="text-3xl font-bold">Login</h2>
            <p className="text-gray-600 mt-2">
              Entre com sua conta para continuar
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-[#8B5CF6] hover:underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED]"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Não tem uma conta?{" "}
              <Link to="/register" className="text-[#8B5CF6] hover:underline">
                Cadastre-se
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}