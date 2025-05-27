
import { useState, useEffect } from 'react';
import { useContactSettings } from '@/hooks/useContactSettings';
import { CandidateHeader } from '@/components/candidate/Header';
import { CandidateSidebar } from '@/components/candidate/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save } from 'lucide-react';

export default function ContactSettings() {
  const isMobile = useIsMobile();
  const { contactSettings, isLoading, updateContactSettings, isUpdating } = useContactSettings();
  
  const [formData, setFormData] = useState({
    email: 'contato@datahireclub.com.br',
    phone: '(11) 4002-8922',
    location: 'São Paulo, SP'
  });

  // Atualizar o formulário quando os dados carregarem
  useEffect(() => {
    if (contactSettings) {
      setFormData({
        email: contactSettings.email,
        phone: contactSettings.phone,
        location: contactSettings.location
      });
    }
  }, [contactSettings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactSettings(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <CandidateHeader />
        <div className="flex">
          {!isMobile && <CandidateSidebar />}
          <main className="flex-1 py-6 px-4 md:py-8 md:px-8">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <CandidateHeader />
      <div className="flex">
        {!isMobile && <CandidateSidebar />}
        <main className="flex-1 py-6 px-4 md:py-8 md:px-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configurações de Contato</h1>
              <p className="text-gray-600">Gerencie as informações de contato exibidas no rodapé do site.</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
                <CardDescription>
                  Essas informações serão exibidas no rodapé de todas as páginas do site.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="contato@datahireclub.com.br"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      type="text"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(11) 4002-8922"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Localização</Label>
                    <Input
                      id="location"
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="São Paulo, SP"
                      required
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Salvar Alterações
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
