import { useState } from "react";
import { CandidateSidebar } from "@/components/candidate/Sidebar";
import { Input } from "@/components/ui/input";
import { Search, Menu, LogOut } from "lucide-react";
import { JobsList } from "@/components/jobs/JobsList";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function CandidateJobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const location = useLocation();

  // Simulando dados do usuário (substituir quando tivermos autenticação)
  const user = {
    name: "João Silva",
    photoUrl: null
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const SidebarContent = () => (
    <div className="h-full py-4">
      <CandidateSidebar />
    </div>
  );

  const isCommunityRoute = location.pathname.includes('/community');

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <div className="sticky top-0 z-50 w-full border-b bg-[#8B5CF6] text-white">
        <div className="container flex h-14 items-center justify-between">
          {isMobile ? (
            <>
              <Sheet>
                <SheetTrigger asChild>
                  <button className="mr-4">
                    <Menu className="h-6 w-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <SidebarContent />
                </SheetContent>
              </Sheet>
              <span className="font-bold">Data Hire Club</span>
            </>
          ) : (
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">Data Hire Club</span>
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-1">
        {!isMobile && <CandidateSidebar />}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            {!isCommunityRoute ? (
              <>
                <h1 className="text-xl md:text-2xl font-bold text-[#1A1F2C] mb-4 md:mb-6 text-center">
                  Vagas Publicadas Recentemente
                </h1>
                
                <div className="max-w-2xl mx-auto mb-4 md:mb-8">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8E9196]" />
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
              </>
            ) : (
              <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold text-[#1A1F2C] mb-6">
                  {location.pathname.includes('introductions') && "Apresente-se"}
                  {location.pathname.includes('learning') && "O que você está aprendendo"}
                  {location.pathname.includes('questions') && "Tire suas dúvidas"}
                  {location.pathname.includes('links') && "Links externos"}
                </h1>
                <p className="text-[#8E9196]">
                  Conteúdo em desenvolvimento. Em breve você poderá interagir com outros membros da comunidade aqui!
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg md:text-xl font-bold mb-4">Data Hire Club</h4>
              <p className="text-gray-300">
                Conectando os melhores talentos em dados com as empresas mais inovadoras do Brasil.
              </p>
            </div>
            <div>
              <h4 className="text-lg md:text-xl font-bold mb-4">Contato</h4>
              <p className="text-gray-300">
                Email: contato@datahireclub.com.br<br />
                Tel: (11) 4002-8922<br />
                São Paulo, SP
              </p>
            </div>
            <div>
              <h4 className="text-lg md:text-xl font-bold mb-4">Links Úteis</h4>
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
}
