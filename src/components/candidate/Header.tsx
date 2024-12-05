import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

export function CandidateHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-black text-white">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">Data Hire Club</span>
        </Link>
        <div className="flex flex-1 items-center justify-end">
          <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}