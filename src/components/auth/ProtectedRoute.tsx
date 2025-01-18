import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: "candidate" | "company";
}

export function ProtectedRoute({ children, requiredUserType }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verifica a sessão atual
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Busca o perfil do usuário
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error("Erro ao buscar perfil:", profileError);
          throw profileError;
        }

        setUserType(profile?.user_type || null);
        setIsAuthenticated(true);

      } catch (error) {
        console.error("Erro na verificação de autenticação:", error);
        setIsAuthenticated(false);
        toast({
          title: "Erro de autenticação",
          description: "Por favor, faça login novamente",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Executa a verificação inicial
    checkAuth();

    // Configura o listener de mudança de estado
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUserType(null);
        setIsLoading(false);
      }

      if (event === 'SIGNED_IN' && session) {
        checkAuth();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  // Renderização com base no estado
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredUserType && userType !== requiredUserType) {
    const redirectPath = userType === 'company' ? '/company/dashboard' : '/candidate/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}