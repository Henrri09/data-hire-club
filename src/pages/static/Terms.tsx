
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import supabase from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StaticPage } from '@/types/staticPage.types';

export default function Terms() {
  const [page, setPage] = useState<StaticPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const { data, error } = await supabase
          .from('static_pages')
          .select('*')
          .eq('slug', 'termos-de-uso')
          .eq('published', true)
          .maybeSingle();

        if (error) throw error;
        setPage(data);
      } catch (err: any) {
        setError('Página não encontrada');
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Não foi possível carregar a página solicitada',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [toast]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto py-16 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto py-16 flex flex-col items-center gap-4">
          <h1 className="text-2xl font-bold">Página não encontrada</h1>
          <p>Desculpe, não foi possível encontrar a página solicitada.</p>
          <Button asChild>
            <Link to="/">Voltar para a página inicial</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto py-8 px-4 flex-grow">
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      </main>
      
      {/* Footer */}
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
              <h4 className="text-lg font-bold mb-4">Contato</h4>
              <p className="text-gray-300">
                Email: contato@datahireclub.com.br<br />
                Tel: (11) 4002-8922<br />
                São Paulo, SP
              </p>
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
    </div>
  );
}
