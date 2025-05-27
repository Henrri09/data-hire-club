
import { Link } from 'react-router-dom';
import { useContactSettings } from '@/hooks/useContactSettings';
import { ContactSettingsDialog } from '@/components/admin/ContactSettingsDialog';
import { useQuery } from '@tanstack/react-query';
import supabase from '@/integrations/supabase/client';

export function Footer() {
  const { contactSettings } = useContactSettings();

  // Verificar se o usuário é admin
  const { data: isAdmin } = useQuery({
    queryKey: ['user-admin-status'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      return data?.is_admin || false;
    }
  });

  return (
    <footer className="bg-black text-white py-8 mt-auto">
      <div className="container px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold mb-4">Data Hire Club</h4>
            <p className="text-gray-300">
              Conectando os melhores talentos em dados com as empresas mais inovadoras do Brasil.
            </p>
          </div>
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <h4 className="text-lg font-bold">Contato</h4>
              {isAdmin && <ContactSettingsDialog />}
            </div>
            {contactSettings ? (
              <p className="text-gray-300">
                Email: {contactSettings.email}<br />
                Tel: {contactSettings.phone}<br />
                {contactSettings.location}
              </p>
            ) : (
              <p className="text-gray-300">
                Email: contato@datahireclub.com.br<br />
                Tel: (11) 4002-8922<br />
                São Paulo, SP
              </p>
            )}
          </div>
          <div className="text-center md:text-left sm:col-span-2 md:col-span-1">
            <h4 className="text-lg font-bold mb-4">Links Úteis</h4>
            <ul className="space-y-2">
              <li><Link to="/sobre" className="text-gray-300 hover:text-white transition-colors">Sobre Nós</Link></li>
              <li><Link to="/termos" className="text-gray-300 hover:text-white transition-colors">Termos de Uso</Link></li>
              <li><Link to="/privacidade" className="text-gray-300 hover:text-white transition-colors">Política de Privacidade</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 Data Hire Club. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
