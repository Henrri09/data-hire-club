import { useState } from "react";
import { LayoutDashboard, UserCog, Briefcase, Users, MessageSquare, BookOpen, Link2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { EditProfileDialog } from "./EditProfileDialog";
import { useToast } from "../ui/use-toast";

interface Profile {
  description: string;
  skills: string[];
  photoUrl: string | null;
}

export function CandidateSidebar() {
  const location = useLocation();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const { toast } = useToast();

  const handleProfileUpdate = (profile: Profile) => {
    console.log("Perfil atualizado:", profile);
    
    toast({
      title: "Perfil atualizado com sucesso",
      description: "Suas informações foram salvas.",
    });
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/candidate/dashboard"
    },
    {
      icon: Briefcase,
      label: "Vagas",
      path: "/candidate/jobs"
    }
  ];

  const communityItems = [
    {
      icon: Users,
      label: "Apresente-se",
      path: "/candidate/jobs/community/introductions"
    },
    {
      icon: BookOpen,
      label: "O que você está aprendendo",
      path: "/candidate/jobs/community/learning"
    },
    {
      icon: MessageSquare,
      label: "Tire suas dúvidas",
      path: "/candidate/jobs/community/questions"
    },
    {
      icon: Link2,
      label: "Links externos",
      path: "/candidate/jobs/community/links"
    }
  ];

  return (
    <aside className="w-64 bg-gray-50 border-r min-h-[calc(100vh-3.5rem)] overflow-y-auto">
      <nav className="sticky top-0 space-y-6 p-4">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Menu Principal
          </h2>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-gray-600 hover:text-[#9b87f5] hover:bg-gray-100 transition-colors text-xs",
                location.pathname === item.path && "text-[#9b87f5] font-medium bg-gray-100"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Comunidade
          </h2>
          {communityItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-gray-600 hover:text-[#9b87f5] hover:bg-gray-100 transition-colors text-xs",
                location.pathname === item.path && "text-[#9b87f5] font-medium bg-gray-100"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="space-y-2">
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-md text-gray-600 hover:text-[#9b87f5] hover:bg-gray-100 transition-colors text-xs"
            )}
          >
            <UserCog className="h-4 w-4" />
            <span>Editar Perfil</span>
          </button>
        </div>
      </nav>

      <EditProfileDialog 
        open={isEditProfileOpen} 
        onOpenChange={setIsEditProfileOpen}
        onProfileUpdate={handleProfileUpdate}
      />
    </aside>
  );
}