import { useState, useEffect } from "react";
import { LayoutDashboard, UserCog, Briefcase, Users, MessageSquare, BookOpen, Link2, Code, Image, FileText, Settings, Palette } from "lucide-react";
import { useLocation } from "react-router-dom";
import { EditProfileDialog } from "./EditProfileDialog";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SidebarMenuItem } from "./sidebar/SidebarMenuItem";
import { SidebarSubmenu } from "./sidebar/SidebarSubmenu";
import { AddLinkDialog } from "./sidebar/AddLinkDialog";
import { EditLinkDialog } from "./sidebar/EditLinkDialog";
import { useIsMobile } from "@/hooks/use-mobile";

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

interface CandidateSidebarProps {
  isMobileSheet?: boolean;
}

export function CandidateSidebar({ isMobileSheet = false }: CandidateSidebarProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [isEditLinkOpen, setIsEditLinkOpen] = useState(false);
  const [linkToEdit, setLinkToEdit] = useState<SubMenuItem | null>(null);
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
    setLinkToEdit(item);
    setIsEditLinkOpen(true);
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este link?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('community_external_links')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchInternalLinks();
      toast({
        title: "Link excluído",
        description: "O link foi removido com sucesso",
      });
    } catch (error) {
      console.error('Erro ao deletar link:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o link",
        variant: "destructive",
      });
    }
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
    },
    {
      icon: Image,
      label: "Banners",
      path: "/candidate/admin/banners"
    },
    {
      icon: FileText,
      label: "Páginas",
      path: "/candidate/admin/static-pages"
    },
    {
      icon: Settings,
      label: "Contato",
      path: "/candidate/admin/contact-settings"
    },
    {
      icon: Palette,
      label: "Interface",
      path: "/candidate/admin/ui-settings"
    }
  ];

  // Classes condicionais baseadas no contexto (mobile sheet vs desktop sidebar)
  const containerClasses = isMobileSheet || isMobile
    ? "w-full bg-gray-50 h-full overflow-y-auto"
    : "w-64 bg-gray-50 border-r fixed top-14 h-[calc(100vh-3.5rem)] overflow-y-auto";

  const navClasses = isMobileSheet || isMobile
    ? "space-y-4 p-4 pb-6"
    : "space-y-6 p-4";

  const sectionSpacing = isMobileSheet || isMobile
    ? "space-y-3"
    : "space-y-2";

  const headerClasses = isMobileSheet || isMobile
    ? "text-sm font-semibold text-gray-600 uppercase tracking-wider px-1"
    : "text-sm font-semibold text-gray-500 uppercase tracking-wider";

  return (
    <aside className={containerClasses}>
      <nav className={navClasses}>
        <div className={sectionSpacing}>
          <h2 className={headerClasses}>
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

        <div className={sectionSpacing}>
          <h2 className={headerClasses}>
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
          <div className={sectionSpacing}>
            <h2 className={headerClasses}>
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

        <div className={sectionSpacing}>
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors ${isMobileSheet || isMobile ? "text-sm" : "text-xs"
              }`}
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

      <EditLinkDialog
        open={isEditLinkOpen}
        onOpenChange={setIsEditLinkOpen}
        onSuccess={fetchInternalLinks}
        linkToEdit={linkToEdit}
      />
    </aside>
  );
}
