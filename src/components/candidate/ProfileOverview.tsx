import { useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { EditProfileDialog } from "./EditProfileDialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "../ui/use-toast";
import { MapPin, Briefcase } from "lucide-react";
import { Badge } from "../ui/badge";

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

  const applicationData = [
    { name: 'Pendentes', value: 3 },
    { name: 'Rejeitadas', value: 1 },
    { name: 'Aceitas', value: 2 },
  ];

  const APPLICATION_COLORS = ['#2563eb', '#ef4444', '#22c55e'];

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
            // Convertendo explicitamente o array de Json para array de strings
            skills: Array.isArray(profileData.skills) 
              ? profileData.skills.map(skill => String(skill))
              : [],
            photoUrl: profileData.logo_url,
            full_name: profileData.full_name,
            headline: profileData.headline,
            location: profileData.location
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
    console.log('Perfil atualizado:', updatedProfile);
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-gray-900">Seu Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">
                {profile.full_name || "Complete seu perfil"}
              </h3>
              <p className="text-gray-600">{profile.headline || "Adicione seu cargo atual"}</p>
              
              <div className="flex flex-col md:flex-row gap-3 text-gray-500 text-sm">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  Disponível para propostas
                </span>
              </div>
            </div>

            {profile.skills.length > 0 && (
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
            )}

            <div className="text-center mt-4">
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="w-full md:w-auto"
              >
                Editar Perfil
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-gray-900">Candidaturas</CardTitle>
          <p className="text-sm text-gray-500">Status das suas candidaturas</p>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={applicationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {applicationData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={APPLICATION_COLORS[index % APPLICATION_COLORS.length]}
                      className="hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-around mt-4 text-sm">
            <div className="text-center">
              <p className="text-xl font-bold text-primary">3</p>
              <p className="text-gray-500">Pendentes</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-red-500">1</p>
              <p className="text-gray-500">Rejeitadas</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-green-500">2</p>
              <p className="text-gray-500">Aceitas</p>
            </div>
          </div>
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