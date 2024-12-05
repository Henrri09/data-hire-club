import { CandidateHeader } from "@/components/candidate/Header";
import { CandidateSidebar } from "@/components/candidate/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, ExternalLink, Menu } from "lucide-react";
import { EditProfileDialog } from "@/components/candidate/EditProfileDialog";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

export default function CandidateDashboard() {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const isMobile = useIsMobile();

  // Mock data - em produção viria da API
  const profile = {
    name: "João Silva",
    role: "Engenheiro de Dados",
    location: "São Paulo, SP",
    type: "Disponível para propostas",
    photoUrl: null,
    skills: ["Python", "SQL", "AWS", "Spark", "Data Engineering"],
    description: "Profissional com experiência em projetos de dados...",
    applications: [
      {
        company: "TechCorp",
        role: "Engenheiro de Dados Sênior",
        date: "14/02/2024",
        applicationUrl: "https://techcorp.com/careers"
      },
      {
        company: "DataTech",
        role: "Especialista em Big Data",
        date: "09/02/2024",
        applicationUrl: "https://datatech.com/jobs"
      }
    ]
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const SidebarContent = () => (
    <CandidateSidebar />
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <CandidateHeader />
      <div className="flex flex-1">
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="fixed bottom-4 right-4 z-50 rounded-full bg-primary text-white shadow-lg">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        ) : (
          <SidebarContent />
        )}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
            {/* Profile Card */}
            <Card className="border-none shadow-md">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                  <Avatar className="h-20 w-20 md:h-24 md:w-24">
                    <AvatarImage src={profile.photoUrl || undefined} />
                    <AvatarFallback className="bg-[#9b87f5] text-white text-xl">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{profile.name}</h2>
                        <p className="text-gray-600">{profile.role}</p>
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-2 text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {profile.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {profile.type}
                          </span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => setIsEditProfileOpen(true)}
                        className="w-full md:w-auto bg-[#9b87f5] hover:bg-[#9b87f5]/90"
                      >
                        Editar Perfil
                      </Button>
                    </div>
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill) => (
                          <Badge 
                            key={skill}
                            variant="secondary"
                            className="bg-[#9b87f5]/10 text-[#9b87f5] hover:bg-[#9b87f5]/20"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Applications Card */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Minhas Candidaturas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.applications.map((application, index) => (
                    <div 
                      key={index}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-white border border-gray-100 hover:border-[#9b87f5]/30 transition-colors gap-4"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{application.role}</h3>
                        <p className="text-gray-600">{application.company}</p>
                      </div>
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                        <span className="text-sm text-gray-500">{application.date}</span>
                        <a 
                          href={application.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[#9b87f5] hover:text-[#9b87f5]/80 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="text-sm">Acessar vaga</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg md:text-xl font-bold mb-4">Data Hire Club</h4>
              <p className="text-gray-400">
                Conectando os melhores talentos em dados com as empresas mais inovadoras do Brasil.
              </p>
            </div>
            <div>
              <h4 className="text-lg md:text-xl font-bold mb-4">Contato</h4>
              <p className="text-gray-400">
                Email: contato@datahireclub.com.br<br />
                Tel: (11) 4002-8922<br />
                São Paulo, SP
              </p>
            </div>
            <div>
              <h4 className="text-lg md:text-xl font-bold mb-4">Links Úteis</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">Sobre Nós</Link></li>
                <li><Link to="/terms" className="hover:text-white">Termos de Uso</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Política de Privacidade</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Data Hire Club. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      <EditProfileDialog 
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        onProfileUpdate={() => {
          setIsEditProfileOpen(false);
        }}
      />
    </div>
  );
}