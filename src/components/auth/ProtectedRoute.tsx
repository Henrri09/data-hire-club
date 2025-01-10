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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (!session) {
          setIsAuthenticated(false);
          return;
        }

        // Verificar se o token está expirado
        const tokenExpirationTime = new Date(session.expires_at! * 1000);
        const currentTime = new Date();
        
        if (tokenExpirationTime <= currentTime) {
          // Token expirado, fazer refresh
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError) {
            throw refreshError;
          }

          if (!refreshData.session) {
            setIsAuthenticated(false);
            toast({
              title: "Sessão expirada",
              description: "Por favor, faça login novamente",
              variant: "destructive",
            });
            return;
          }
        }

        // Se chegou aqui, o usuário está autenticado
        if (session.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          setUserType(profile?.user_type || null);
          setIsAuthenticated(true);
        }

      } catch (error: any) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        toast({
          title: "Erro de autenticação",
          description: error.message || "Ocorreu um erro ao verificar sua autenticação",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Configurar listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setIsAuthenticated(false);
        setUserType(null);
      } else if (event === 'SIGNED_IN' && session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();

        setUserType(profile?.user_type || null);
        setIsAuthenticated(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

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