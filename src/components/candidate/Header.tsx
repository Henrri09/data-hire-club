import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { LogOut, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { CandidateSidebar } from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import supabase from "@/integrations/supabase/client";
import { useToast } from "../ui/use-toast";
import { LevelBadge } from "../gamification/LevelBadge";

interface Profile {
  full_name: string | null;
  logo_url: string | null;
  is_admin: boolean | null;
}

export function CandidateHeader() {
  const isMobile = useIsMobile();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          const { data, error } = await supabase
            .from('profiles')
            .select('full_name, logo_url, is_admin')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error loading profile:', error);
            return;
          }

          setProfile(data);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro ao tentar fazer logout.",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-black text-white">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <CandidateSidebar />
              </SheetContent>
            </Sheet>
          )}

          <Link to="/" className="flex items-center">
            <span className="font-bold whitespace-nowrap">Data Hire Club</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {userId && (
            <div className="hidden sm:block">
              <LevelBadge userId={userId} showPoints />
            </div>
          )}
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={profile?.logo_url || undefined}
              className="object-cover"
            />
            <AvatarFallback className="bg-white/20 text-white">
              {profile?.full_name ? getInitials(profile.full_name) : "?"}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-white/80"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}