import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { supabase } from "@/integrations/supabase/client";

interface LevelBadgeProps {
  userId: string;
  showPoints?: boolean;
}

interface UserLevel {
  total_points: number;
  current_level: number;
  next_level?: {
    name: string;
    points_required: number;
  };
  current_level_info?: {
    name: string;
  };
}

export function LevelBadge({ userId, showPoints = false }: LevelBadgeProps) {
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserLevel = async () => {
      try {
        // First try to get existing points
        const { data: pointsData, error: pointsError } = await supabase
          .from('user_points')
          .select('total_points, current_level')
          .eq('user_id', userId)
          .maybeSingle();

        if (pointsError) throw pointsError;

        // If no points exist, create initial record
        if (!pointsData) {
          const { data: newPointsData, error: createError } = await supabase
            .from('user_points')
            .insert([
              { user_id: userId, total_points: 0, current_level: 1 }
            ])
            .select('total_points, current_level')
            .single();

          if (createError) {
            // If insert fails due to race condition, try to fetch again
            if (createError.code === '23505') {
              const { data: retryData } = await supabase
                .from('user_points')
                .select('total_points, current_level')
                .eq('user_id', userId)
                .single();
              
              if (retryData) {
                const { data: currentLevelData } = await supabase
                  .from('gamification_levels')
                  .select('name')
                  .eq('level', retryData.current_level)
                  .single();

                const { data: nextLevelData } = await supabase
                  .from('gamification_levels')
                  .select('name, points_required')
                  .eq('level', retryData.current_level + 1)
                  .single();

                setUserLevel({
                  ...retryData,
                  current_level_info: currentLevelData,
                  next_level: nextLevelData
                });
              }
            } else {
              throw createError;
            }
          } else if (newPointsData) {
            const { data: currentLevelData } = await supabase
              .from('gamification_levels')
              .select('name')
              .eq('level', 1)
              .single();

            const { data: nextLevelData } = await supabase
              .from('gamification_levels')
              .select('name, points_required')
              .eq('level', 2)
              .single();

            setUserLevel({
              ...newPointsData,
              current_level_info: currentLevelData,
              next_level: nextLevelData
            });
          }
        } else {
          // Get current and next level info
          const { data: currentLevelData } = await supabase
            .from('gamification_levels')
            .select('name')
            .eq('level', pointsData.current_level)
            .single();

          const { data: nextLevelData } = await supabase
            .from('gamification_levels')
            .select('name, points_required')
            .eq('level', pointsData.current_level + 1)
            .single();

          setUserLevel({
            ...pointsData,
            current_level_info: currentLevelData,
            next_level: nextLevelData
          });
        }
      } catch (error) {
        console.error('Error loading user level:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      loadUserLevel();
    }
  }, [userId]);

  if (isLoading) {
    return <Skeleton className="h-6 w-16" />;
  }

  if (!userLevel) {
    return (
      <Badge variant="outline" className="bg-gray-100">
        Nível 1
      </Badge>
    );
  }

  const progress = userLevel.next_level
    ? Math.round((userLevel.total_points / userLevel.next_level.points_required) * 100)
    : 100;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge 
            variant="outline" 
            className="bg-[#9b87f5]/10 text-[#9b87f5] hover:bg-[#9b87f5]/20"
          >
            {userLevel.current_level_info?.name || `Nível ${userLevel.current_level}`}
            {showPoints && ` • ${userLevel.total_points} pts`}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            {userLevel.next_level
              ? `${userLevel.total_points} / ${userLevel.next_level.points_required} pontos para ${userLevel.next_level.name}`
              : "Nível máximo atingido!"}
          </p>
          <div className="mt-1 h-1 w-full bg-gray-200 rounded-full">
            <div
              className="h-1 bg-[#9b87f5] rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}