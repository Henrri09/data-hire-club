import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LogoUpload } from "./LogoUpload";

interface CompanyProfile {
  company_name: string;
  logo_url: string | null;
  industry: string | null;
  location: string | null;
}

export function ProfileTab() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('company_name, logo_url, industry, location')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os dados da empresa",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoChange = async (logoUrl: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('profiles')
        .update({ logo_url: logoUrl })
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, logo_url: logoUrl } : null);
    } catch (error) {
      console.error('Erro ao atualizar logo:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o logo",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const formData = new FormData(e.target as HTMLFormElement);
      const updates = {
        company_name: formData.get('companyName')?.toString() || '',
        industry: formData.get('industry')?.toString() || null,
        location: formData.get('location')?.toString() || null,
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: "Perfil atualizado",
        description: "As informações da empresa foram atualizadas com sucesso",
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar as informações",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Perfil da Empresa</CardTitle>
          <CardDescription>Carregando...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil da Empresa</CardTitle>
        <CardDescription>
          Gerencie as informações da sua empresa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label>Logo da Empresa</Label>
          <div className="mt-2">
            <LogoUpload
              currentLogoUrl={profile?.logo_url || null}
              onLogoChange={handleLogoChange}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nome da Empresa</Label>
              <Input 
                id="companyName" 
                name="companyName"
                defaultValue={profile?.company_name || ''}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Setor</Label>
              <Input 
                id="industry" 
                name="industry"
                defaultValue={profile?.industry || ''}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Input 
                id="location" 
                name="location"
                defaultValue={profile?.location || ''}
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="bg-[#7779f5] hover:bg-[#7779f5]/90"
            disabled={isLoading}
          >
            Salvar Alterações
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}