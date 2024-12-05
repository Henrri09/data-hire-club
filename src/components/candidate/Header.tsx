import { LogOut, UserRound } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function CandidateHeader() {
  const handleLogout = () => {
    // Implementar lógica de logout quando tivermos autenticação
    console.log("Logout clicked");
  };

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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-black text-white">
      <div className="container flex h-14 items-center justify-between">
        <span className="font-bold">Data Hire Club</span>
        <div className="flex items-center gap-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoUrl || undefined} />
            <AvatarFallback className="bg-[#7779f5] text-white">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10" 
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}