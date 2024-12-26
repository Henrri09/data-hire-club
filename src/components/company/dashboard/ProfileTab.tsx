import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

interface CompanyProfile {
  company_name: string;
  logo_url: string | null;
  industry: string | null;
  location: string | null;
}

export function ProfileTab() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('company_name, logo_url, industry, location')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(profile);
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

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validar tipo do arquivo
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Tipo de arquivo inválido",
          description: "Por favor, selecione apenas imagens",
        });
        return;
      }

      setIsUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      // Upload para o bucket 'logos'
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      // Atualizar perfil com nova URL do logo
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ logo_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile(prev => prev ? { ...prev, logo_url: publicUrl } : null);
      
      toast({
        title: "Logo atualizado",
        description: "O logo da empresa foi atualizado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: "Não foi possível fazer upload do logo",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const formData = new FormData(e.target as HTMLFormElement);
      const updates = {
        company_name: formData.get('companyName'),
        industry: formData.get('industry'),
        location: formData.get('location'),
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
          <div className="mt-2 flex items-center space-x-4">
            <div className="relative w-24 h-24 group cursor-pointer">
              {profile?.logo_url ? (
                <img
                  src={profile.logo_url}
                  alt="Logo da empresa"
                  className="w-full h-full object-cover rounded-lg border-2 border-[#7779f5]/20"
                />
              ) : (
                <div className="w-full h-full rounded-lg bg-[#E5DEFF] flex items-center justify-center border-2 border-[#7779f5]/20">
                  <Upload className="w-6 h-6 text-[#7779f5]/60" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                Clique para fazer upload do logo da sua empresa.
                Formatos aceitos: JPG, PNG. Tamanho máximo: 2MB
              </p>
            </div>
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