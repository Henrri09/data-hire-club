import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileHeader } from "./MobileHeader";

export function Navbar() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileHeader />;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-black text-white">
      <div className="container flex h-24 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <img 
            src="/lovable-uploads/6e308181-180a-4c1e-90e4-1b3e51e6d1a5.png" 
            alt="Hire Club" 
            className="h-24 w-auto"
          />
        </Link>
        <nav className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center gap-4">
            <Link to="/candidatos" className="text-gray-300 hover:text-white">
              Para Candidatos
            </Link>
            <Link to="/company/login" className="text-gray-300 hover:text-white">
              Publique uma vaga
            </Link>
            <Button asChild variant="outline" className="text-[#7779f5] border-[#7779f5] hover:bg-[#7779f5]/10">
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild className="bg-[#7779f5] hover:bg-[#7779f5]/90">
              <Link to="/register">Cadastrar</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}