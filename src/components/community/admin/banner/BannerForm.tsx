import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
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

interface BannerFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function BannerForm({ onSuccess, onCancel }: BannerFormProps) {
  const { toast } = useToast()
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      image_url: "",
      link_url: "",
    },
  })

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
      form.reset()
      onSuccess()
    }
  }

  return (
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
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  )
}