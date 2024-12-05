import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function CompanyHeader() {
  // Simulando dados da empresa (substituir quando tivermos autenticação)
  const company = {
    name: "Empresa Exemplo",
    photoUrl: null
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-black text-white">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">Data Hire Club</span>
        </Link>
        <div className="flex flex-1 items-center justify-end gap-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={company.photoUrl || undefined} />
            <AvatarFallback className="bg-white/20 text-white">
              {getInitials(company.name)}
            </AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}