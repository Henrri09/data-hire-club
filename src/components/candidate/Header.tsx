import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { LogOut, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { CandidateSidebar } from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export function CandidateHeader() {
  const isMobile = useIsMobile();
  
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
      <div className="container flex h-14 items-center">
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2 text-white hover:text-white/80">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <CandidateSidebar />
            </SheetContent>
          </Sheet>
        )}
        
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">Data Hire Club</span>
        </Link>
        <div className="flex flex-1 items-center justify-end gap-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoUrl || undefined} />
            <AvatarFallback className="bg-white/20 text-white">
              {getInitials(user.name)}
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