
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useContactSettings } from '@/hooks/useContactSettings';
import { Save, Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CandidateHeader } from '@/components/candidate/Header';
import { CandidateSidebar } from '@/components/candidate/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const ContactSettings = () => {
  const { contactSettings, updateContactSettings, isUpdating } = useContactSettings();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [formData, setFormData] = useState({
    email: 'contato@datahireclub.com.br',
    phone: '(11) 4002-8922',
    location: 'São Paulo, SP'
  });

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

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen flex w-full">
      <CandidateHeader />
      {!isMobile && <CandidateSidebar />}
      
      <main className={`flex-1 ${isMobile ? 'pt-14' : 'pt-14 pl-64'}`}>
        <div className="container mx-auto p-6 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Configurações de Contato
              </CardTitle>
              <p className="text-sm text-gray-600">
                Gerencie as informações de contato que aparecem no rodapé do site
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="contato@datahireclub.com.br"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="(11) 4002-8922"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Localização
                  </Label>
                  <Input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="São Paulo, SP"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isUpdating}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isUpdating ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ContactSettings;
