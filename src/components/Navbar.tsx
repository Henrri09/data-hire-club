import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">Data Hire Club</span>
        </Link>
        <nav className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center gap-4">
            <Link to="/jobs">Vagas</Link>
            <Link to="/company/login">Publique uma vaga</Link>
            <Button asChild variant="outline">
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Cadastrar</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}