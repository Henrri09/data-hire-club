import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Banner {
  id: string
  title: string
  is_active: boolean
}

interface BannerListProps {
  banners: Banner[]
  onUpdate: () => void
}

export function BannerList({ banners, onUpdate }: BannerListProps) {
  const { toast } = useToast()

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
      onUpdate()
    }
  }

  return (
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
  )
}