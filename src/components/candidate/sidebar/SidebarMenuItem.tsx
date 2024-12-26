import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarMenuItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isActive: boolean;
}

export function SidebarMenuItem({ icon: Icon, label, path, isActive }: SidebarMenuItemProps) {
  return (
    <Link
      to={path}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors text-xs",
        isActive && "font-medium bg-gray-100"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}