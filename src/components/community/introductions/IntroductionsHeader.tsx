import { Button } from "@/components/ui/button"
import { Settings2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface IntroductionsHeaderProps {
  isAdmin: boolean
  onOpenBannerDialog: () => void
  onOpenRulesDialog: () => void
}

export function IntroductionsHeader({ 
  isAdmin, 
  onOpenBannerDialog, 
  onOpenRulesDialog 
}: IntroductionsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">Apresente-se à Comunidade</h1>
      {isAdmin && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings2 className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onOpenBannerDialog}>
              Gerenciar Banner
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onOpenRulesDialog}>
              Gerenciar Regras
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}