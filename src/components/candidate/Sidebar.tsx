import { useState } from "react";
import { LayoutDashboard, UserCog, Briefcase } from "lucide-react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { EditProfileDialog } from "./EditProfileDialog";
import { useToast } from "../ui/use-toast";

// Interface para o perfil do usuário
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
    // Aqui você pode implementar a lógica para salvar o perfil
    // Por exemplo, fazer uma chamada à API
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

  return (
    <aside className="w-64 bg-gray-50 border-r p-4 min-h-[calc(100vh-3.5rem)]">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-gray-600 hover:text-[#7779f5] hover:bg-gray-100 transition-colors",
              location.pathname === item.path && "text-[#7779f5] font-medium bg-gray-100"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
        <button
          onClick={() => setIsEditProfileOpen(true)}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded-md text-gray-600 hover:text-[#7779f5] hover:bg-gray-100 transition-colors"
          )}
        >
          <UserCog className="h-5 w-5" />
          <span>Editar Perfil</span>
        </button>
      </nav>

      <EditProfileDialog 
        open={isEditProfileOpen} 
        onOpenChange={setIsEditProfileOpen}
        onProfileUpdate={handleProfileUpdate}
      />
    </aside>
  );
}