import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { EditProfileDialog } from "./EditProfileDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "../ui/use-toast";
import { ProfileHeader } from "./profile/ProfileHeader";
import { ApplicationsChart } from "./profile/ApplicationsChart";

interface Profile {
  description: string;
  skills: string[];
  photoUrl: string | null;
  full_name: string | null;
  headline: string | null;
  location: string | null;
}

export function ProfileOverview() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    description: "",
    skills: [],
    photoUrl: null,
    full_name: null,
    headline: null,
    location: null
  });
  const { toast } = useToast();

  // Carregar dados reais de candidaturas do banco
  const [applicationData, setApplicationData] = useState([
    { name: 'Pendentes', value: 0 },
    { name: 'Rejeitadas', value: 0 },
    { name: 'Aceitas', value: 0 },
  ]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: "Erro ao carregar perfil",
            description: "Usuário não autenticado",
            variant: "destructive",
          });
          return;
        }

        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('full_name, bio, skills, logo_url, headline, location')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (profileData) {
          setProfile({
            description: profileData.bio || "",
            skills: Array.isArray(profileData.skills) 
              ? profileData.skills.map(skill => String(skill))
              : [],
            photoUrl: profileData.logo_url,
            full_name: profileData.full_name,
            headline: profileData.headline,
            location: profileData.location
          });
        }

        // Carregar contagem de candidaturas
        const { data: applications, error: applicationsError } = await supabase
          .from('job_applications')
          .select('status')
          .eq('candidate_id', user.id);

        if (applicationsError) throw applicationsError;

        if (applications) {
          const pending = applications.filter(app => app.status === 'pending').length;
          const rejected = applications.filter(app => app.status === 'rejected').length;
          const accepted = applications.filter(app => app.status === 'accepted').length;

          setApplicationData([
            { name: 'Pendentes', value: pending },
            { name: 'Rejeitadas', value: rejected },
            { name: 'Aceitas', value: accepted },
          ]);
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        toast({
          title: "Erro ao carregar perfil",
          description: "Ocorreu um erro ao carregar suas informações",
          variant: "destructive",
        });
      }
    };

    loadProfile();
  }, [toast]);

  const handleProfileUpdate = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-gray-900">Seu Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileHeader 
            profile={profile} 
            onEditClick={() => setIsDialogOpen(true)} 
          />
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-gray-900">Candidaturas</CardTitle>
          <p className="text-sm text-gray-500">Status das suas candidaturas</p>
        </CardHeader>
        <CardContent>
          <ApplicationsChart applicationData={applicationData} />
        </CardContent>
      </Card>

      <EditProfileDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
}