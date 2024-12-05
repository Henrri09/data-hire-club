import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function ProfileOverview() {
  const profileCompletionData = [
    { name: 'Completo', value: 75 },
    { name: 'Incompleto', value: 25 },
  ];

  const applicationData = [
    { name: 'Pendentes', value: 3 },
    { name: 'Rejeitadas', value: 1 },
    { name: 'Aceitas', value: 2 },
  ];

  const COLORS = ['#7779f5', '#e5e7eb'];
  const APPLICATION_COLORS = ['#7779f5', '#ef4444', '#22c55e'];

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-gray-900">Completude do Perfil</CardTitle>
          <p className="text-sm text-gray-500">Acompanhe o progresso do seu perfil</p>
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
            <p className="text-3xl font-bold text-[#7779f5]">75%</p>
            <p className="text-sm text-gray-500">do perfil completo</p>
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
              <p className="text-xl font-bold text-[#7779f5]">3</p>
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
    </div>
  );
}