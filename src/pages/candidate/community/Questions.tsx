import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { CommunityBanner } from "@/components/community/CommunityBanner"
import { Button } from "@/components/ui/button"
import { Settings2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AdminBannerDialog } from "@/components/community/admin/AdminBannerDialog"
import { AdminRulesDialog } from "@/components/community/admin/AdminRulesDialog"

export default function Questions() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [showBannerDialog, setShowBannerDialog] = useState(false)
  const [showRulesDialog, setShowRulesDialog] = useState(false)

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single()
        
        setIsAdmin(profile?.is_admin || false)
      }
    }

    checkAdminStatus()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tire suas Dúvidas</h1>
        {isAdmin && (
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
        )}
      </div>

      <CommunityBanner />

      <AdminBannerDialog 
        open={showBannerDialog} 
        onOpenChange={setShowBannerDialog} 
      />
      
      <AdminRulesDialog
        open={showRulesDialog}
        onOpenChange={setShowRulesDialog}
      />
    </div>
  )
}