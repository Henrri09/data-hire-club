import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-black text-white">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">Data Hire Club</span>
        </Link>
        <nav className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center gap-4">
            <Link to="/company/login" className="text-gray-300 hover:text-white">Publique uma vaga</Link>
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