import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ApplicationsChartProps {
  applicationData: Array<{
    name: string;
    value: number;
  }>;
}

export function ApplicationsChart({ applicationData }: ApplicationsChartProps) {
  const APPLICATION_COLORS = ['#2563eb', '#ef4444', '#22c55e'];

  return (
    <>
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
          <p className="text-xl font-bold text-primary">{applicationData[0].value}</p>
          <p className="text-gray-500">Pendentes</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-red-500">{applicationData[1].value}</p>
          <p className="text-gray-500">Rejeitadas</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-green-500">{applicationData[2].value}</p>
          <p className="text-gray-500">Aceitas</p>
        </div>
      </div>
    </>
  );
}