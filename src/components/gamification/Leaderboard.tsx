
import { useEffect, useState } from "react";
import supabase from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { LevelBadge } from "./LevelBadge";

interface UserPointsData {
  id: string;
  user_id: string;
  total_points: number;
  current_level: number;
  profile: {
    full_name: string | null;
    logo_url?: string | null;
  } | null;
}

export function Leaderboard() {
  const [userPoints, setUserPoints] = useState<UserPointsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserPoints() {
      try {
        const { data, error } = await supabase
          .from('user_points')
          .select('*, profile:profiles(full_name, logo_url)')
          .order('total_points', { ascending: false })
          .limit(10);

        if (error) {
          throw error;
        }

        console.log('User points data:', data);
        setUserPoints(data || []);
      } catch (error) {
        console.error('Error loading leaderboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserPoints();
  }, []);

  function getInitials(name: string | null | undefined): string {
    if (!name) return "U";
    
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Ranking da Comunidade</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array(5)
                .fill(null)
                .map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-4 w-[120px]" />
                    </div>
                  </div>
                ))}
            </div>
          ) : userPoints.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Nenhum dado de pontuação encontrado
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Rank</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead className="text-right">Pontos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userPoints.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          {user.profile?.logo_url ? (
                            <AvatarImage src={user.profile.logo_url} alt={user.profile?.full_name || 'Usuário'} />
                          ) : null}
                          <AvatarFallback>{getInitials(user.profile?.full_name)}</AvatarFallback>
                        </Avatar>
                        <span>{user.profile?.full_name || 'Usuário Anônimo'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <LevelBadge level={user.current_level} />
                    </TableCell>
                    <TableCell className="text-right">{user.total_points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
