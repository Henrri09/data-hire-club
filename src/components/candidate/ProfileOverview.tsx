import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { EditProfileDialog } from "./EditProfileDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "../ui/use-toast";
import { ProfileHeader } from "./profile/ProfileHeader";
import { ApplicationsChart } from "./profile/ApplicationsChart";
import { useQuery } from "@tanstack/react-query";

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

  const { data: applicationData = [
    { name: 'Pendentes', value: 0 },
    { name: 'Rejeitadas', value: 0 },
    { name: 'Aceitas', value: 0 },
  ], refetch: refetchApplications } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data: applications, error } = await supabase
        .from('job_applications')
        .select('status')
        .eq('candidate_id', user.id)
        .is('deleted_at', null);

      if (error) throw error;

      const pending = applications?.filter(app => app.status === 'pending').length || 0;
      const rejected = applications?.filter(app => app.status === 'rejected').length || 0;
      const accepted = applications?.filter(app => app.status === 'accepted').length || 0;

      return [
        { name: 'Pendentes', value: pending },
        { name: 'Rejeitadas', value: rejected },
        { name: 'Aceitas', value: accepted },
      ];
    },
  });

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
            bio,
            skills,
            logo_url,
            headline,
            location,
            experience_level,
            linkedin_url,
            github_url,
            portfolio_url
          `)
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
            location: profileData.location,
            experience_level: profileData.experience_level,
            linkedin_url: profileData.linkedin_url,
            github_url: profileData.github_url,
            portfolio_url: profileData.portfolio_url
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

    const channel = supabase
      .channel('job_applications_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_applications'
        },
        () => {
          refetchApplications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
