import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useState } from "react";
import supabase from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function CompanyHeader() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<{
    full_name: string;
    logo_url: string | null;
  } | null>(null);

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, logo_url')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado da sua conta",
      });
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao tentar desconectar. Tente novamente.",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-black text-white">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">Data Hire Club</span>
        </Link>
        <div className="flex flex-1 items-center justify-end gap-4">
          <Avatar className="h-8 w-8">
            {profile?.logo_url ? (
              <AvatarImage src={profile.logo_url} alt="Logo da empresa" />
            ) : (
              <AvatarFallback className="bg-white/20 text-white">
                {profile?.full_name ? getInitials(profile.full_name) : ''}
              </AvatarFallback>
            )}
          </Avatar>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-white/80"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}