import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { EditProfileDialog } from "./EditProfileDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "../ui/use-toast";
import { ProfileHeader } from "./profile/ProfileHeader";

interface Profile {
  description: string;
  skills: string[];
  photoUrl: string | null;
  full_name: string | null;
  headline: string | null;
  location: string | null;
  experience_level: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
}

export function ProfileOverview() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    description: "",
    skills: [],
    photoUrl: null,
    full_name: null,
    headline: null,
    location: null,
    experience_level: null,
    linkedin_url: null,
    github_url: null,
    portfolio_url: null
  });
  const { toast } = useToast();

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
          .select(`
            full_name,
            logo_url,
            linkedin_url,
            location
          `)
          .eq('id', user.id)
          .single();

        if (error) throw error;

        const { data: candidateData, error: candidateError } = await supabase
          .from('candidates')
          .select('bio, skills, headline, experience_level, github_url, portfolio_url')
          .eq('profile_id', user.id)
          .single();

        if (candidateError) throw candidateError;

        if (profileData) {
          setProfile({
            description: candidateData.bio || "",
            skills: Array.isArray(candidateData.skills)
              ? candidateData.skills.map(skill => String(skill))
              : [],
            photoUrl: profileData.logo_url,
            full_name: profileData.full_name,
            headline: candidateData.headline,
            location: profileData.location,
            experience_level: candidateData.experience_level,
            linkedin_url: profileData.linkedin_url,
            github_url: candidateData.github_url,
            portfolio_url: candidateData.portfolio_url
          });
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
    <div className="w-full px-4 sm:px-0 max-w-4xl mx-auto">
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="space-y-1 px-4 sm:px-6">
          <CardTitle className="text-2xl font-bold text-gray-900">Seu Perfil</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <ProfileHeader
            profile={profile}
            onEditClick={() => setIsDialogOpen(true)}
          />
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