import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
  const { toast } = useToast()
  const [banners, setBanners] = useState<Banner[]>([])
  const [isAddingBanner, setIsAddingBanner] = useState(false)

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      image_url: "",
      link_url: "",
    },
  })

  const fetchBanners = async () => {
    const { data } = await supabase
      .from("community_banners")
      .select("*")
      .order("created_at", { ascending: false })
    
    if (data) setBanners(data)
  }

  const onSubmit = async (values: any) => {
    const { error } = await supabase
      .from("community_banners")
      .insert([{ ...values, is_active: true }])

    if (error) {
      toast({
        title: "Erro ao criar banner",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Banner criado com sucesso",
      })
      setIsAddingBanner(false)
      form.reset()
      fetchBanners()
    }
  }

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Banners</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Button onClick={() => setIsAddingBanner(true)}>Novo Banner</Button>

          {isAddingBanner && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="link_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL do Link</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button type="submit">Criar Banner</Button>
                  <Button type="button" variant="outline" onClick={() => setIsAddingBanner(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          )}

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
      </DialogContent>
    </Dialog>
  )
}