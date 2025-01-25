import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

type DisplayType = "MOBILE" | "DESKTOP"

interface Banner {
  id: string
  title: string
  description: string | null
  image_url: string
  link_url: string | null
  is_active: boolean
  type: "INTRODUCTION" | "LEARNING" | "QUESTIONS"
  display: DisplayType
  created_at: string
}

interface BannerListProps {
  banners: Banner[]
  onUpdate: () => void
}

export function BannerList({ banners, onUpdate }: BannerListProps) {
  const { toast } = useToast()

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

  const handleDelete = async (banner: Banner) => {
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

  return (
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
              <img
                src={banner.image_url}
                alt="Banner"
                className="w-40 h-20 object-cover rounded-md"
              />
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
  )
}