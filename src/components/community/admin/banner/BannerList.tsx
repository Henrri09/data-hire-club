import { useToast } from "@/hooks/use-toast"
import supabase from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CommunityBanner } from "@/types/job.types"
import { useIsMobile } from "@/hooks/use-mobile"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface BannerListProps {
  banners: CommunityBanner[]
  onUpdate: () => void
}

export function BannerList({ banners, onUpdate }: BannerListProps) {
  const { toast } = useToast()
  const isMobile = useIsMobile()
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({})

  const handleImageLoad = (bannerId: string) => {
    setLoadingImages(prev => ({ ...prev, [bannerId]: false }))
  }

  const handleImageLoadStart = (bannerId: string) => {
    setLoadingImages(prev => ({ ...prev, [bannerId]: true }))
  }

  const toggleBannerStatus = async (id: string, currentStatus: boolean) => {
    try {
      if (!currentStatus) {
        const bannerToActivate = banners.find(b => b.id === id)
        if (bannerToActivate) {
          await supabase
            .from("community_banners")
            .update({ is_active: false })
            .eq("type", bannerToActivate.type)
            .eq("display", bannerToActivate.display)
            .eq("is_active", true)
        }
      }

      const { error } = await supabase
        .from("community_banners")
        .update({ is_active: !currentStatus })
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Banner atualizado",
        description: `Banner ${!currentStatus ? "ativado" : "desativado"} com sucesso!`,
      })

      onUpdate()
    } catch (error) {
      console.error("Erro ao atualizar banner:", error)
      toast({
        title: "Erro ao atualizar banner",
        description: "Ocorreu um erro ao tentar atualizar o status do banner.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (banner: CommunityBanner) => {
    try {
      if (banner.is_active) {
        const nextBanner = banners.find(b =>
          b.type === banner.type &&
          b.display === banner.display &&
          b.id !== banner.id
        );

        if (nextBanner) {
          await supabase
            .from("community_banners")
            .update({ is_active: true })
            .eq("id", nextBanner.id);
        }
      }
      const { error } = await supabase
        .from("community_banners")
        .delete()
        .eq("id", banner.id);

      if (error) throw error;

      toast({
        title: "Banner excluído",
        description: "O banner foi excluído com sucesso!",
      });

      onUpdate();
    } catch (error) {
      console.error("Erro ao excluir banner:", error);
      toast({
        title: "Erro ao excluir banner",
        description: "Ocorreu um erro ao tentar excluir o banner.",
        variant: "destructive",
      });
    }
  };

  if (banners.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        Nenhum banner encontrado.
      </div>
    )
  }

  // Mobile view with cards
  if (isMobile) {
    return (
      <div className="space-y-4">
        {banners.map((banner) => (
          <Card key={banner.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="aspect-video w-full overflow-hidden rounded-md relative bg-gray-100">
                  {loadingImages[banner.id] && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  )}
                  <img
                    src={banner.image_url || ''}
                    alt="Banner"
                    className="w-full h-full object-cover"
                    onLoadStart={() => handleImageLoadStart(banner.id)}
                    onLoad={() => handleImageLoad(banner.id)}
                    onError={() => handleImageLoad(banner.id)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Status</p>
                    <Switch
                      checked={banner.is_active}
                      onCheckedChange={() => toggleBannerStatus(banner.id, banner.is_active)}
                    />
                  </div>

                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium">Criado em</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(banner.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(banner)}
                  className="w-full"
                >
                  Excluir Banner
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Desktop view with table
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Imagem</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banners.map((banner) => (
            <TableRow key={banner.id}>
              <TableCell>
                <div className="relative w-40 h-20 bg-gray-100 rounded-md overflow-hidden">
                  {loadingImages[banner.id] && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                  <img
                    src={banner.image_url || ''}
                    alt="Banner"
                    className="w-full h-full object-cover"
                    onLoadStart={() => handleImageLoadStart(banner.id)}
                    onLoad={() => handleImageLoad(banner.id)}
                    onError={() => handleImageLoad(banner.id)}
                  />
                </div>
              </TableCell>
              <TableCell>
                <Switch
                  checked={banner.is_active}
                  onCheckedChange={() => toggleBannerStatus(banner.id, banner.is_active)}
                />
              </TableCell>
              <TableCell>
                {format(new Date(banner.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(banner)}
                >
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
