import { useState } from "react";
import { ChevronDown, Edit, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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

export function SidebarSubmenu({
  isAdmin,
  items,
  onAddItem,
  onEditItem,
  onDeleteItem
}: SidebarSubmenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full justify-between text-gray-600 hover:bg-gray-100",
          isMobile ? "py-3 px-3" : "py-2 px-3"
        )}
      >
        <span className={isMobile ? "text-sm" : "text-xs"}>Links Externos</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "transform rotate-180")} />
      </Button>

      {isOpen && (
        <div className={cn("pl-4 mt-1", isMobile ? "space-y-2" : "space-y-1")}>
          {items.map((item) => (
            <div key={item.id} className="flex items-center group">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex-1 text-gray-600 hover:bg-gray-100 rounded-md px-3",
                  isMobile ? "text-sm py-3" : "text-xs py-2"
                )}
              >
                {item.title}
              </a>
              {isAdmin && (
                <div className={cn(
                  "items-center gap-1 pr-2",
                  isMobile ? "flex" : "hidden group-hover:flex"
                )}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={isMobile ? "h-8 w-8" : "h-6 w-6"}
                    onClick={() => onEditItem(item)}
                  >
                    <Edit className={isMobile ? "h-4 w-4" : "h-3 w-3"} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "text-red-500 hover:text-red-600",
                      isMobile ? "h-8 w-8" : "h-6 w-6"
                    )}
                    onClick={() => onDeleteItem(item.id)}
                  >
                    <Trash2 className={isMobile ? "h-4 w-4" : "h-3 w-3"} />
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
              className={cn(
                "w-full justify-start text-gray-600 hover:bg-gray-100",
                isMobile ? "text-sm py-3 px-3" : "text-xs py-2 px-3"
              )}
            >
              <Plus className={cn("mr-2", isMobile ? "h-4 w-4" : "h-3 w-3")} />
              Adicionar novo link
            </Button>
          )}
        </div>
      )}
    </div>
  );
}