
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Settings2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AdminBannerDialog } from "./admin/AdminBannerDialog"
import { AdminRulesDialog } from "./admin/AdminRulesDialog"

interface CommunityHeaderProps {
  title: string;
  description?: string;
  isAdmin?: boolean;
}

export function CommunityHeader({ title, description, isAdmin = false }: CommunityHeaderProps) {
  const [showBannerDialog, setShowBannerDialog] = useState(false)
  const [showRulesDialog, setShowRulesDialog] = useState(false)

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        {isAdmin && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowBannerDialog(true)}>
                  Gerenciar Banner
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowRulesDialog(true)}>
                  Gerenciar Regras
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <AdminBannerDialog 
              open={showBannerDialog} 
              onOpenChange={setShowBannerDialog} 
            />
            
            <AdminRulesDialog
              open={showRulesDialog}
              onOpenChange={setShowRulesDialog}
            />
          </>
        )}
      </div>
      {description && (
        <p className="text-gray-600">{description}</p>
      )}
    </div>
  )
}
