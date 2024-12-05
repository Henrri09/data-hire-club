import { CandidateHeader } from "@/components/candidate/Header";
import { CandidateSidebar } from "@/components/candidate/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin } from "lucide-react";
import { EditProfileDialog } from "@/components/candidate/EditProfileDialog";
import { useState } from "react";

export default function CandidateDashboard() {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

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
        status: "Em análise",
        date: "2024-02-15"
      },
      {
        company: "DataTech",
        role: "Especialista em Big Data",
        status: "Entrevista",
        date: "2024-02-10"
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

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <CandidateHeader />
      <div className="flex">
        <CandidateSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Profile Card */}
            <Card className="border-none shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.photoUrl || undefined} />
                    <AvatarFallback className="bg-[#9b87f5] text-white text-xl">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                        <p className="text-gray-600">{profile.role}</p>
                        <div className="flex items-center gap-4 mt-2 text-gray-500">
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
                        className="bg-[#9b87f5] hover:bg-[#9b87f5]/90"
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
                <CardTitle>Minhas Candidaturas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.applications.map((application, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-white border border-gray-100 hover:border-[#9b87f5]/30 transition-colors"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900">{application.role}</h3>
                        <p className="text-gray-600">{application.company}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="secondary"
                          className="bg-[#9b87f5]/10 text-[#9b87f5]"
                        >
                          {application.status}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1">{new Date(application.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <EditProfileDialog 
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        onProfileUpdate={() => {
          // Implementar atualização do perfil
          setIsEditProfileOpen(false);
        }}
      />
    </div>
  );
}