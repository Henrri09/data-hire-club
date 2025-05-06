import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import supabase from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LogoUpload } from "./LogoUpload";

interface CompanyProfile {
  name: string;
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

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, logo_url, location')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('name, industry, location')
        .eq('id', user.id)
        .maybeSingle();

      if (companyError) {
        console.error('Erro ao carregar dados da empresa:', companyError);
      }

      const combinedData = {
        ...profileData,
        industry: companyData?.industry ? companyData?.industry : '',
        location: companyData?.location ? companyData?.location : profileData?.location,
        name: companyData?.name ? companyData?.name : profileData?.full_name
      };

      setProfile(combinedData);
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

      const profileUpdates = {
        full_name: formData.get('companyName')?.toString() || '',
        location: formData.get('location')?.toString() || null,
      };

      const companyUpdates = {
        name: profileUpdates.full_name,
        industry: formData.get('industry')?.toString() || null,
        location: profileUpdates.location,
      };

      // Atualiza tabela profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Atualiza tabela companies
      const { error: companyError } = await supabase
        .from('companies')
        .update(companyUpdates)
        .eq('id', user.id);

      if (companyError) {
        console.error('Erro ao atualizar companies:', companyError);
        // Não interrompe o fluxo se falhar apenas a atualização da tabela companies
      }

      setProfile(prev => prev ? { ...prev, ...profileUpdates, ...companyUpdates } : null);

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
                defaultValue={profile?.name || ''}
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