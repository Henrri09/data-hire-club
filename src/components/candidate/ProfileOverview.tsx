import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { EditProfileDialog } from "./EditProfileDialog";
import { useState } from "react";
import { Progress } from "../ui/progress";

interface Profile {
  description: string;
  skills: string[];
  photoUrl: string | null;
}

export function ProfileOverview() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    description: "",
    skills: [],
    photoUrl: null
  });

  // Calcula a porcentagem de completude do perfil
  const calculateProfileCompletion = () => {
    let completed = 0;
    const total = 3; // Total de critérios (foto, descrição > 200 palavras, 5+ habilidades)

    if (profile.photoUrl) completed++;
    if (profile.description.length >= 200) completed++;
    if (profile.skills.length >= 5) completed++;

    return Math.round((completed / total) * 100);
  };

  const completion = calculateProfileCompletion();

  const profileCompletionData = [
    { name: 'Completo', value: completion },
    { name: 'Incompleto', value: 100 - completion },
  ];

  const applicationData = [
    { name: 'Pendentes', value: 3 },
    { name: 'Rejeitadas', value: 1 },
    { name: 'Aceitas', value: 2 },
  ];

  const COLORS = ['#2563eb', '#e5e7eb'];
  const APPLICATION_COLORS = ['#2563eb', '#ef4444', '#22c55e'];

  const handleProfileUpdate = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
    // Aqui você pode adicionar a lógica para salvar no backend
    console.log('Profile updated:', updatedProfile);
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-gray-900">Complete seu perfil</CardTitle>
          <p className="text-sm text-gray-500">
            Para atingir 100% você precisa:
            <ul className="mt-2 list-disc list-inside">
              <li>Adicionar uma foto</li>
              <li>Escrever uma descrição com pelo menos 200 palavras</li>
              <li>Adicionar pelo menos 5 habilidades</li>
            </ul>
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={profileCompletionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {profileCompletionData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      className="hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-4">
            <p className="text-3xl font-bold text-primary">{completion}%</p>
            <p className="text-sm text-gray-500 mb-4">do perfil completo</p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="w-full md:w-auto"
            >
              Editar Perfil
            </Button>
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