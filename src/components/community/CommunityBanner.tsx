import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Banner {
  id: string
  image_url?: string
}

type CommunityBannerType = 'INTRODUCTION' | 'LEARNING' | 'QUESTIONS'

export function CommunityBanner({ type }: { type: CommunityBannerType }) {
  const [banner, setBanner] = useState<Banner | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchBanner = async () => {
      const { data, error } = await supabase
        .from('community_banners')
        .select('id, image_url')
        .eq('is_active', true)
        .eq('type', type)
        .order('created_at', { ascending: false })
        .limit(1)
      if (data && data.length > 0) {
        setBanner(data[0])
      }

      if (error) {
        console.error('Error fetching banner:', error)
      }
    }

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
  }, [])

  const handleDelete = async () => {
    if (!banner) return

    try {
      const { error } = await supabase
        .from('community_banners')
        .update({ is_active: false })
        .eq('id', banner.id)

      if (error) throw error

      setBanner(null)
      toast({
        title: "Banner removido",
        description: "O banner foi removido com sucesso.",
      })
    } catch (error) {
      console.error('Error deleting banner:', error)
      toast({
        title: "Erro ao remover banner",
        description: "Ocorreu um erro ao tentar remover o banner.",
        variant: "destructive"
      })
    }
  }

  if (!banner?.image_url) return null

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
            variant="destructive"
            size="icon"
            className="absolute top-8 right-8"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}