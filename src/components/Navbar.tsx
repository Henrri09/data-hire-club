import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">Data Hire Club</span>
          </Link>

          {isMobile ? (
            <>
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
              {isMenuOpen && (
                <div className="absolute top-16 left-0 right-0 bg-white border-b p-4 flex flex-col space-y-4">
                  <Link to="/jobs" className="text-gray-600 hover:text-primary">
                    Vagas
                  </Link>
                  <Link to="/companies" className="text-gray-600 hover:text-primary">
                    Empresas
                  </Link>
                  <div className="flex flex-col space-y-2">
                    <Button asChild variant="ghost">
                      <Link to="/login">Entrar</Link>
                    </Button>
                    <Button asChild>
                      <Link to="/register">Cadastrar</Link>
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center space-x-8">
              <div className="flex space-x-6">
                <Link to="/jobs" className="text-gray-600 hover:text-primary">
                  Vagas
                </Link>
                <Link to="/companies" className="text-gray-600 hover:text-primary">
                  Empresas
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Button asChild variant="ghost">
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Cadastrar</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}