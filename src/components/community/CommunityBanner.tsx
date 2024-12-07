import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent } from "@/components/ui/card"

interface Banner {
  id: string
  title: string
  description?: string
  image_url?: string
  link_url?: string
}

export function CommunityBanner() {
  const [banner, setBanner] = useState<Banner | null>(null)

  useEffect(() => {
    const fetchBanner = async () => {
      const { data, error } = await supabase
        .from('community_banners')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        
      // Instead of using .single(), we check if data exists and take the first item
      if (data && data.length > 0) {
        setBanner(data[0])
      }
    }

    fetchBanner()
  }, [])

  if (!banner) return null

  return (
    <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5">
      <CardContent className="p-6">
        {banner.image_url && (
          <img 
            src={banner.image_url} 
            alt={banner.title}
            className="rounded-lg mb-4 w-full h-32 object-cover" 
          />
        )}
        <h2 className="text-xl font-semibold mb-2">{banner.title}</h2>
        {banner.description && (
          <p className="text-gray-600 mb-4">{banner.description}</p>
        )}
        {banner.link_url && (
          <a 
            href={banner.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Saiba mais →
          </a>
        )}
      </CardContent>
    </Card>
  )
}