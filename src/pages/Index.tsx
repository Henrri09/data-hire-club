import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Users, Search, MapPin } from "lucide-react";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  seniority: string;
  salary_range: string;
  contract_type: string;
}

const ITEMS_PER_PAGE = 9;

const fetchJobs = async ({ pageParam = 0, searchQuery = "" }) => {
  // Simulando uma chamada à API
  const mockJobs: Job[] = Array.from({ length: ITEMS_PER_PAGE }, (_, i) => ({
    id: pageParam * ITEMS_PER_PAGE + i + 1,
    title: `Analista de Dados ${pageParam * ITEMS_PER_PAGE + i + 1}`,
    company: "TechBR Solutions",
    location: "São Paulo, SP",
    type: "Remoto",
    description: "Experiência com Python, SQL e ferramentas de visualização.",
    seniority: "Sênior",
    salary_range: "R$ 8.000 - R$ 12.000",
    contract_type: "CLT"
  })).filter(job => 
    searchQuery === "" || 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    jobs: mockJobs,
    nextPage: mockJobs.length === ITEMS_PER_PAGE ? pageParam + 1 : undefined,
  };
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['jobs', searchQuery],
    queryFn: ({ pageParam }) => fetchJobs({ pageParam, searchQuery }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const allJobs = data?.pages.flatMap(page => page.jobs) ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-16 hero-pattern">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Encontre Sua Próxima Oportunidade em Dados
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Conecte-se com as melhores empresas que contratam profissionais de dados. Sua próxima posição em análise, engenharia ou ciência de dados está aqui.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/register">
                  Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Jobs Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar vagas por título, empresa ou localização..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                <p className="text-gray-600 mb-4">{job.company}</p>
                <div className="flex gap-4 text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {job.type}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{job.description}</p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Senioridade: {job.seniority}</p>
                  <p className="text-sm text-gray-600">Faixa Salarial: {job.salary_range}</p>
                  <p className="text-sm text-gray-600">Contratação: {job.contract_type}</p>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Ver Detalhes
                </Button>
              </div>
            ))}
          </div>

          {(isLoading || isFetchingNextPage) && (
            <div className="text-center mt-8">
              Carregando mais vagas...
            </div>
          )}

          <div ref={ref} className="h-10" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Vagas Selecionadas</h3>
              <p className="text-gray-600">
                Oportunidades exclusivas em dados das principais empresas de tecnologia.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Comunidade</h3>
              <p className="text-gray-600">
                Conecte-se com outros profissionais de dados e expanda sua rede.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Match Inteligente</h3>
              <p className="text-gray-600">
                Encontre oportunidades que combinam com suas habilidades e experiência.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">Data Hire Club</h4>
              <p className="text-gray-400">
                Conectando os melhores talentos em dados com as empresas mais inovadoras do Brasil.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Contato</h4>
              <p className="text-gray-400">
                Email: contato@datahireclub.com.br<br />
                Tel: (11) 4002-8922<br />
                São Paulo, SP
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Links Úteis</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">Sobre Nós</Link></li>
                <li><Link to="/terms" className="hover:text-white">Termos de Uso</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Política de Privacidade</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Data Hire Club. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;