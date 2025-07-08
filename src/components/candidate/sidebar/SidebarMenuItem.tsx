import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarMenuItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isActive: boolean;
}

export function SidebarMenuItem({ icon: Icon, label, path, isActive }: SidebarMenuItemProps) {
  const isMobile = useIsMobile();

  return (
    <Link
      to={path}
      className={cn(
        "flex items-center gap-3 px-3 py-3 rounded-md text-gray-600 hover:bg-gray-100 transition-colors",
        isMobile ? "text-sm" : "text-xs",
        isActive && "font-medium bg-gray-100 text-gray-900"
      )}
    >
      <Icon className={cn("h-4 w-4", isMobile && "h-5 w-5")} />
      <span className="truncate">{label}</span>
    </Link>
  );
}