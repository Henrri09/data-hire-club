import { Input } from "@/components/ui/input";
import { Search, Briefcase, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { JobsList } from "@/components/jobs/JobsList";
import { Navbar } from "@/components/Navbar";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-8 md:py-16 bg-white">
        <div className="container px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
            <div className="text-left max-w-2xl mb-8 md:mb-0">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#8B5CF6] mb-3 md:mb-6">
                Encontre Sua Próxima Oportunidade em Dados
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-[#8E9196] mb-4 md:mb-8">
                Conecte-se com as melhores empresas que contratam profissionais de dados. 
                Sua próxima posição em análise, engenharia ou ciência de dados está aqui.
              </p>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <img 
                src="/lovable-uploads/bd797d1f-1c30-453c-b7f0-865aeec8bae0.png"
                alt="Data Analysis Illustration" 
                className="w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search and Jobs Section */}
      <section className="py-4 md:py-12 bg-[#f8fafc]">
        <div className="container px-4 md:px-8">
          <div className="max-w-2xl mx-auto mb-4 md:mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8E9196] h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar vagas..."
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
      <section className="py-6 md:py-12 bg-white">
        <div className="container px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#8B5CF6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-6 w-6 text-[#8B5CF6]" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#8B5CF6]">Vagas Selecionadas</h3>
              <p className="text-sm text-[#8E9196]">
                Oportunidades exclusivas em dados das principais empresas de tecnologia.
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#8B5CF6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-[#8B5CF6]" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#8B5CF6]">Comunidade</h3>
              <p className="text-sm text-[#8E9196]">
                Conecte-se com outros profissionais de dados e expanda sua rede.
              </p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow sm:col-span-2 md:col-span-1">
              <div className="w-12 h-12 bg-[#8B5CF6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-[#8B5CF6]" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#8B5CF6]">Match Inteligente</h3>
              <p className="text-sm text-[#8E9196]">
                Encontre oportunidades que combinam com suas habilidades e experiência.
              </p>
            </div>
          </div>
        </div>
      </section>

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
                <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">Sobre Nós</Link></li>
                <li><Link to="/terms" className="text-gray-300 hover:text-white transition-colors">Termos de Uso</Link></li>
                <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">Política de Privacidade</Link></li>
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
};

export default Index;