import { LayoutDashboard, UserCog, Briefcase } from "lucide-react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { EditProfileDialog } from "./EditProfileDialog";

export function CandidateSidebar() {
  const location = useLocation();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

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
    <aside className="w-64 bg-black border-r border-white/10 p-4 min-h-[calc(100vh-3.5rem)]">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors",
              location.pathname === item.path && "text-white font-medium bg-white/10"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
        <button
          onClick={() => setIsEditProfileOpen(true)}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          )}
        >
          <UserCog className="h-5 w-5" />
          <span>Editar Perfil</span>
        </button>
      </nav>

      <EditProfileDialog 
        open={isEditProfileOpen} 
        onOpenChange={setIsEditProfileOpen}
      />
    </aside>
  );
}