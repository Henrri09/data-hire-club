import { useState } from "react";
import { CandidateSidebar } from "@/components/candidate/Sidebar";
import { Input } from "@/components/ui/input";
import { Search, Menu } from "lucide-react";
import { JobsList } from "@/components/jobs/JobsList";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function CandidateJobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const location = useLocation();

  const SidebarContent = () => (
    <div className="h-full py-4">
      <CandidateSidebar />
    </div>
  );

  const isCommunityRoute = location.pathname.includes('/community');

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <div className="sticky top-0 z-50 w-full border-b bg-[#8B5CF6] text-white">
        <div className="container flex h-14 items-center justify-between">
          {isMobile ? (
            <>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2 text-white hover:text-white/80">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <SidebarContent />
                </SheetContent>
              </Sheet>
              <Link to="/" className="font-bold text-white hover:text-white/90">
                Data Hire Club
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/" className="font-bold text-white hover:text-white/90">
                Data Hire Club
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 relative">
        {!isMobile && <CandidateSidebar />}
        <main className="flex-1 p-4 md:p-8 ml-64">
          <div className="max-w-5xl mx-auto">
            {!isCommunityRoute ? (
              <>
                <h1 className="text-xl md:text-2xl font-bold text-[#1A1F2C] mb-4 md:mb-6 text-center">
                  Vagas Publicadas Recentemente
                </h1>
                
                <div className="max-w-2xl mx-auto mb-4 md:mb-8">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8E9196]" />
                    <Input
                      type="text"
                      placeholder="Buscar vagas..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <JobsList searchQuery={searchQuery} />
              </>
            ) : (
              <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold text-[#1A1F2C] mb-6">
                  {location.pathname.includes('introductions') && "Apresente-se"}
                  {location.pathname.includes('learning') && "O que você está aprendendo"}
                  {location.pathname.includes('questions') && "Tire suas dúvidas"}
                  {location.pathname.includes('links') && "Links externos"}
                </h1>
                <p className="text-[#8E9196]">
                  Conteúdo em desenvolvimento. Em breve você poderá interagir com outros membros da comunidade aqui!
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}