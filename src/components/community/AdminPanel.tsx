import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SimpleBannerUpload } from "./banner/SimpleBannerUpload"

interface Banner {
  id: string
  title: string
  is_active: boolean
}

export function AdminPanel() {
  const { toast } = useToast()
  const [banners, setBanners] = useState<Banner[]>([])
  const [isAddingBanner, setIsAddingBanner] = useState(false)

  const fetchBanners = async () => {
    const { data: bannersData } = await supabase
      .from("community_banners")
      .select("*")
      .order("created_at", { ascending: false })
    
    if (bannersData) setBanners(bannersData)
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  const toggleBannerStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("community_banners")
      .update({ is_active: !currentStatus })
      .eq("id", id)

    if (error) {
      toast({
        title: "Erro ao atualizar banner",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Banner atualizado com sucesso",
      })
      fetchBanners()
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Banners</h2>
          <Button onClick={() => setIsAddingBanner(true)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Novo Banner
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell>{banner.title}</TableCell>
                <TableCell>{banner.is_active ? "Ativo" : "Inativo"}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    onClick={() => toggleBannerStatus(banner.id, banner.is_active)}
                  >
                    {banner.is_active ? "Desativar" : "Ativar"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <SimpleBannerUpload 
        open={isAddingBanner}
        onOpenChange={setIsAddingBanner}
        onSuccess={fetchBanners}
      />
    </div>
  )
}