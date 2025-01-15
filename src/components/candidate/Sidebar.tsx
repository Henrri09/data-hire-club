import { useState, useEffect } from "react";
import { LayoutDashboard, UserCog, Briefcase, Users, MessageSquare, BookOpen, Link2, Code } from "lucide-react";
import { useLocation } from "react-router-dom";
import { EditProfileDialog } from "./EditProfileDialog";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SidebarMenuItem } from "./sidebar/SidebarMenuItem";
import { SidebarSubmenu } from "./sidebar/SidebarSubmenu";
import { AddLinkDialog } from "./sidebar/AddLinkDialog";

interface Profile {
  description: string;
  skills: string[];
  photoUrl: string | null;
  is_admin?: boolean;
  full_name?: string | null;
  headline?: string | null;
  location?: string | null;
  experience_level?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  portfolio_url?: string | null;
}

interface SubMenuItem {
  id: string;
  title: string;
  url: string;
}

export function CandidateSidebar() {
  const location = useLocation();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [internalLinks, setInternalLinks] = useState<SubMenuItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
    fetchInternalLinks();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      
      setIsAdmin(profile?.is_admin || false);
    }
  };

  const fetchInternalLinks = async () => {
    const { data, error } = await supabase
      .from('community_external_links')
      .select('*')
      .order('order_index');

    if (data) {
      setInternalLinks(data);
    }
  };

  const handleAddLink = () => {
    setIsAddLinkOpen(true);
  };

  const handleEditLink = async (item: SubMenuItem) => {
    toast({
      title: "Editar link",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  const handleDeleteLink = async (id: string) => {
    toast({
      title: "Deletar link",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  const handleProfileUpdate = (profile: Profile) => {
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso",
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
    }
  ];

  const adminItems = [
    {
      icon: Code,
      label: "Traqueamento",
      path: "/candidate/admin/seo-scripts"
    }
  ];

  return (
    <aside className="w-64 bg-gray-50 border-r fixed top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
      <nav className="space-y-6 p-4">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Menu Principal
          </h2>
          {menuItems.map((item) => (
            <SidebarMenuItem
              key={item.path}
              {...item}
              isActive={location.pathname === item.path}
            />
          ))}
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Comunidade
          </h2>
          {communityItems.map((item) => (
            <SidebarMenuItem
              key={item.path}
              {...item}
              isActive={location.pathname === item.path}
            />
          ))}
          
          <SidebarSubmenu
            isAdmin={isAdmin}
            items={internalLinks}
            onAddItem={handleAddLink}
            onEditItem={handleEditLink}
            onDeleteItem={handleDeleteLink}
          />
        </div>

        {isAdmin && (
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Administração
            </h2>
            {adminItems.map((item) => (
              <SidebarMenuItem
                key={item.path}
                {...item}
                isActive={location.pathname === item.path}
              />
            ))}
          </div>
        )}

        <div className="space-y-2">
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors text-xs"
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

      <AddLinkDialog
        open={isAddLinkOpen}
        onOpenChange={setIsAddLinkOpen}
        onSuccess={fetchInternalLinks}
      />
    </aside>
  );
}
