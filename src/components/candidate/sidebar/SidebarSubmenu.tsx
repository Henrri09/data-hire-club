import { useState } from "react";
import { ChevronDown, Edit, Plus, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SubMenuItem {
  id: string;
  title: string;
  url: string;
}

interface SidebarSubmenuProps {
  isAdmin: boolean;
  items: SubMenuItem[];
  onAddItem: () => void;
  onEditItem: (item: SubMenuItem) => void;
  onDeleteItem: (id: string) => void;
}

export function SidebarSubmenu({ isAdmin, items, onAddItem, onEditItem, onDeleteItem }: SidebarSubmenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between text-gray-600 hover:bg-gray-100"
      >
        <span className="text-xs">Links Internos</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "transform rotate-180")} />
      </Button>

      {isOpen && (
        <div className="pl-4 space-y-1 mt-1">
          {items.map((item) => (
            <div key={item.id} className="flex items-center group">
              <a
                href={item.url}
                className="flex-1 text-xs text-gray-600 hover:bg-gray-100 rounded-md px-3 py-2"
              >
                {item.title}
              </a>
              {isAdmin && (
                <div className="hidden group-hover:flex items-center gap-1 pr-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onEditItem(item)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500 hover:text-red-600"
                    onClick={() => onDeleteItem(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}
          
          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddItem}
              className="w-full justify-start text-xs text-gray-600 hover:bg-gray-100"
            >
              <Plus className="h-3 w-3 mr-2" />
              Adicionar novo link
            </Button>
          )}
        </div>
      )}
    </div>
  );
}