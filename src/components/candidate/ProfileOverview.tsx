import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function ProfileOverview() {
  // Mock data for profile completion
  const profileCompletionData = [
    { name: 'Completed', value: 75 },
    { name: 'Incomplete', value: 25 },
  ];

  // Mock data for job applications
  const applicationData = [
    { name: 'Pending', value: 3 },
    { name: 'Rejected', value: 1 },
    { name: 'Accepted', value: 2 },
  ];

  const COLORS = ['#7779f5', '#e5e7eb'];
  const APPLICATION_COLORS = ['#7779f5', '#ef4444', '#22c55e'];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Completude do Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-4">
            <p className="text-2xl font-bold text-[#7779f5]">75%</p>
            <p className="text-sm text-gray-500">do perfil completo</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Candidaturas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
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
                    <Cell key={`cell-${index}`} fill={APPLICATION_COLORS[index % APPLICATION_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-around mt-4 text-sm">
            <div className="text-center">
              <p className="font-bold text-[#7779f5]">3</p>
              <p className="text-gray-500">Pendentes</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-red-500">1</p>
              <p className="text-gray-500">Rejeitadas</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-green-500">2</p>
              <p className="text-gray-500">Aceitas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}