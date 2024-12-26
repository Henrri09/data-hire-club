import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent } from "@/components/ui/card"

interface Banner {
  id: string
  image_url?: string
}

export function CommunityBanner() {
  const [banner, setBanner] = useState<Banner | null>(null)

  useEffect(() => {
    const fetchBanner = async () => {
      const { data, error } = await supabase
        .from('community_banners')
        .select('id, image_url')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        
      if (data && data.length > 0) {
        setBanner(data[0])
      }

      if (error) {
        console.error('Error fetching banner:', error)
      }
    }

    fetchBanner()
  }, [])

  if (!banner?.image_url) return null

  return (
    <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5">
      <CardContent className="p-6">
        <img 
          src={banner.image_url} 
          alt="Banner da comunidade"
          className="rounded-lg w-full h-32 object-cover" 
        />
      </CardContent>
    </Card>
  )
}