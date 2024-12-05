import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { JobsList } from "@/components/jobs/JobsList";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="pt-32 pb-16 hero-pattern">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-[#1e293b] mb-6">
              Encontre Sua Próxima Oportunidade em Dados
            </h1>
            <p className="text-xl text-[#1e293b]/80 mb-8">
              Conecte-se com as melhores empresas que contratam profissionais de dados. 
              Sua próxima posição em análise, engenharia ou ciência de dados está aqui.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Jobs Section */}
      <section className="py-16 bg-[#f8fafc]">
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

          <JobsList searchQuery={searchQuery} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-[#7779f5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-6 w-6 text-[#7779f5]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#1e293b]">Vagas Selecionadas</h3>
              <p className="text-[#1e293b]/70">
                Oportunidades exclusivas em dados das principais empresas de tecnologia.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-[#7779f5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-[#7779f5]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#1e293b]">Comunidade</h3>
              <p className="text-[#1e293b]/70">
                Conecte-se com outros profissionais de dados e expanda sua rede.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-[#7779f5]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-[#7779f5]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#1e293b]">Match Inteligente</h3>
              <p className="text-[#1e293b]/70">
                Encontre oportunidades que combinam com suas habilidades e experiência.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
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