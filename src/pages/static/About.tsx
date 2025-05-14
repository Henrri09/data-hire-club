
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import supabase from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StaticPage } from '@/types/staticPage.types';

export default function About() {
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
          .eq('slug', 'sobre-nos')
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
    <div>
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      </main>
      <footer className="bg-gray-100 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-4 text-sm text-gray-500">
            <Link to="/sobre" className="hover:text-gray-700">Sobre Nós</Link>
            <span>•</span>
            <Link to="/termos" className="hover:text-gray-700">Termos de Uso</Link>
            <span>•</span>
            <Link to="/privacidade" className="hover:text-gray-700">Política de Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
