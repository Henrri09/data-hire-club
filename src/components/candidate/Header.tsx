import { LogOut } from "lucide-react";
import { Button } from "../ui/button";

export function CandidateHeader() {
  const handleLogout = () => {
    // Implement logout logic when we have authentication
    console.log("Logout clicked");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-black text-white">
      <div className="container flex h-14 items-center justify-between">
        <span className="font-bold">Data Hire Club</span>
        <Button 
          variant="ghost" 
          className="text-white hover:bg-white/10" 
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </header>
  );
}