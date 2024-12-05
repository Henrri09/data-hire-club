import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";

interface MobileHeaderProps {
  sidebarContent?: React.ReactNode;
  showAuthButtons?: boolean;
}

export function MobileHeader({ sidebarContent, showAuthButtons = true }: MobileHeaderProps) {
  return (
    <div className="sticky top-0 z-50 w-full border-b bg-black text-white">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center">
          {sidebarContent && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2 text-white hover:text-white/80">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                {sidebarContent}
              </SheetContent>
            </Sheet>
          )}
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold">Data Hire Club</span>
          </Link>
        </div>
        
        {showAuthButtons && (
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="text-white hover:text-white/80">
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild className="bg-[#7779f5] hover:bg-[#7779f5]/90">
              <Link to="/register">Cadastrar</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}