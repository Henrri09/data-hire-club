import { useEffect, useState } from "react";
import supabase from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { LevelBadge } from "./LevelBadge";
import { Skeleton } from "../ui/skeleton";
import { Trophy } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface LeaderboardUser {
  id: string;
  full_name: string | null;
  total_points: number;
  current_level: number;
}

export function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from('user_points')
          .select(`
            user_id,
            total_points,
            current_level,
            profiles:profiles(full_name)
          `)
          .order('total_points', { ascending: false })
          .limit(10);

        if (error) throw error;

        if (data) {
          const formattedData: LeaderboardUser[] = data.map(item => ({
            id: item.user_id,
            full_name: item.profiles?.full_name || 'Usuário Anônimo',
            total_points: item.total_points,
            current_level: item.current_level
          }));
          setUsers(formattedData);
        }
      } catch (error) {
        console.error('Erro ao carregar leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  if (isLoading) {
    return <Skeleton className="w-full h-64" />;
  }

  if (isMobile) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-semibold">Top 10 da Comunidade</h2>
        </div>
        <div className="space-y-4">
          {users.map((user, index) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-600 min-w-[24px]">
                  {index + 1}º
                </span>
                <div className="flex flex-col">
                  <span className="font-medium">{user.full_name}</span>
                  <LevelBadge userId={user.id} />
                </div>
              </div>
              <span className="font-medium text-primary">
                {user.total_points} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-semibold">Top 10 da Comunidade</h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Pos.</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Nível</TableHead>
              <TableHead className="text-right">Pontos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {index + 1}º
                </TableCell>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>
                  <LevelBadge userId={user.id} />
                </TableCell>
                <TableCell className="text-right">
                  {user.total_points} pts
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}