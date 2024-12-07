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
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2 text-white hover:text-white/80">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-black text-white p-0">
              <div className="flex flex-col py-4">
                {sidebarContent}
                <Link 
                  to="/company/login" 
                  className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Publique uma vaga
                </Link>
                {showAuthButtons && (
                  <>
                    <Link 
                      to="/login" 
                      className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      Entrar
                    </Link>
                    <Link 
                      to="/register" 
                      className="px-4 py-2 text-[#7779f5] hover:text-[#7779f5]/90 hover:bg-white/10 transition-colors"
                    >
                      Cadastrar
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold">Data Hire Club</span>
          </Link>
        </div>
      </div>
    </div>
  );
}