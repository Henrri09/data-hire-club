import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { useIsMobile } from "@/hooks/use-mobile"

type BannerType = "INTRODUCTION" | "LEARNING" | "QUESTIONS"
type DisplayType = "MOBILE" | "DESKTOP"

interface Banner {
  id: string
  image_url: string
  type: BannerType
  display: DisplayType
  is_active: boolean
  created_at: string
}

export function CommunityBanner({ type }: { type: BannerType }) {
  const [banner, setBanner] = useState<Banner | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const { toast } = useToast()
  const isMobile = useIsMobile()
  const displayType: DisplayType = isMobile ? "MOBILE" : "DESKTOP"

  const fetchBanner = async () => {
    const { data, error } = await supabase
      .from('community_banners')
      .select('id, image_url, type, display, is_active, created_at')
      .eq('is_active', true)
      .eq('type', type)
      .eq('display', displayType)
      .order('created_at', { ascending: false })
      .limit(1)

    if (data && data.length > 0) {
      setBanner(data[0] as Banner)
    }

    if (error) {
      console.error('Error fetching banner:', error)
    }
  }

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

    fetchBanner()
    checkAdminStatus()
  }, [type, displayType])

  const navigate = useNavigate()

  const handleEditBanner = async () => {
    if (!banner) return;
    navigate(`/candidate/admin/banners`);
  };

  if (!banner?.image_url) return null;

  return (
    <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5">
      <CardContent className="p-6 relative">
        <img
          src={banner.image_url}
          alt="Banner da comunidade"
          className="rounded-lg w-full h-[315px] object-cover"
        />
        {isAdmin && (
          <Button
            variant="outline"
            size="icon"
            className="absolute top-8 right-8"
            onClick={handleEditBanner}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}