import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BannerForm } from "./banner/BannerForm"
import { BannerList } from "./banner/BannerList"

interface Banner {
  id: string
  title: string
  description?: string
  image_url?: string
  link_url?: string
  is_active: boolean
}

interface AdminBannerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AdminBannerDialog({ open, onOpenChange }: AdminBannerDialogProps) {
  const [banners, setBanners] = useState<Banner[]>([])
  const [isAddingBanner, setIsAddingBanner] = useState(false)

  const fetchBanners = async () => {
    const { data } = await supabase
      .from("community_banners")
      .select("*")
      .order("created_at", { ascending: false })
    
    if (data) setBanners(data)
  }

  useEffect(() => {
    if (open) {
      fetchBanners()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Banners</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Button onClick={() => setIsAddingBanner(true)}>Novo Banner</Button>

          {isAddingBanner ? (
            <BannerForm
              onSuccess={() => {
                setIsAddingBanner(false)
                fetchBanners()
              }}
              onCancel={() => setIsAddingBanner(false)}
            />
          ) : (
            <BannerList banners={banners} onUpdate={fetchBanners} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}