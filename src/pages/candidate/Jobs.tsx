import { useState } from "react";
import { CandidateHeader } from "@/components/candidate/Header";
import { CandidateSidebar } from "@/components/candidate/Sidebar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { JobsList } from "@/components/jobs/JobsList";
import { Link } from "react-router-dom";

export default function CandidateJobs() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <CandidateHeader />
      <div className="flex flex-1">
        <CandidateSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Vagas Disponíveis</h1>
            
            {/* Search Bar */}
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

            {/* Jobs List */}
            <JobsList searchQuery={searchQuery} />
          </div>
        </main>
      </div>

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
}