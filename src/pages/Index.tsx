import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Users, Search, MapPin } from "lucide-react";

const Index = () => {
  const jobListings = [
    {
      id: 1,
      title: "Analista de Dados Sênior",
      company: "TechBR Solutions",
      location: "São Paulo, SP",
      type: "Remoto",
      description: "Experiência com Python, SQL e ferramentas de visualização."
    },
    {
      id: 2,
      title: "Engenheiro de Dados Pleno",
      company: "DataFlow Brasil",
      location: "Rio de Janeiro, RJ",
      type: "Híbrido",
      description: "Conhecimento em Apache Spark, AWS e pipelines de dados."
    },
    {
      id: 3,
      title: "Cientista de Dados",
      company: "IA Inovações",
      location: "Florianópolis, SC",
      type: "Presencial",
      description: "Experiência com Machine Learning e análise estatística."
    }
  ];

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
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link to="/jobs">Ver Todas as Vagas</Link>
              </Button>
            </div>
          </div>
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

      {/* Jobs Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Vagas em Destaque</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobListings.map((job) => (
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
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/jobs/${job.id}`}>Ver Detalhes</Link>
                </Button>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link to="/jobs">Ver Todas as Vagas</Link>
            </Button>
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