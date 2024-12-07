import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("Session found:", session);
        try {
          // Get user profile to determine redirect
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', session.user.id)
            .single();

          console.log("Profile data:", profile, "Error:", error);

          if (error) {
            // Se o perfil não existir, vamos criar um
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: session.user.id,
                  email: session.user.email,
                  user_type: 'candidate', // default type
                }
              ])
              .select('user_type')
              .single();

            console.log("New profile created:", newProfile, "Error:", createError);

            if (!createError && newProfile) {
              navigate('/candidate/dashboard');
              return;
            }
          }

          if (profile?.user_type === 'company') {
            navigate('/company/dashboard');
          } else {
            navigate('/candidate/dashboard');
          }
        } catch (error) {
          console.error("Error checking user profile:", error);
          toast({
            title: "Erro ao verificar perfil",
            description: "Por favor, tente novamente ou contate o suporte.",
            variant: "destructive",
          });
        }
      }
    };

    checkUser();
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        console.log("User logged in:", data.user);
        
        // Get user profile to determine redirect
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', data.user.id)
          .single();

        console.log("Profile after login:", profile, "Error:", profileError);

        if (profileError) {
          // Se o perfil não existir, vamos criar um
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                email: data.user.email,
                user_type: 'candidate', // default type
              }
            ])
            .select('user_type')
            .single();

          console.log("New profile created after login:", newProfile, "Error:", createError);

          if (!createError && newProfile) {
            toast({
              title: "Login realizado com sucesso!",
              description: "Redirecionando para o painel...",
            });
            navigate('/candidate/dashboard');
            return;
          }
        }

        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o painel...",
        });

        if (profile?.user_type === 'company') {
          navigate('/company/dashboard');
        } else {
          navigate('/candidate/dashboard');
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
            <CardTitle className="text-2xl md:text-3xl text-center">Bem-vindo de volta</CardTitle>
            <CardDescription className="text-center">
              Entre com sua conta para acessar a plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu@email.com"
                  className="bg-white"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  className="bg-white"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED]"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
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