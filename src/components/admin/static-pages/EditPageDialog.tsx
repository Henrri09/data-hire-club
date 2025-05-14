
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { StaticPage } from '@/types/staticPage.types';
import { useToast } from '@/hooks/use-toast';
import supabase from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface EditPageDialogProps {
  page: StaticPage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditPageDialog({ page, open, onOpenChange, onSuccess }: EditPageDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<StaticPage>({
    defaultValues: page || {
      title: '',
      slug: '',
      content: '',
      meta_description: '',
      published: false
    }
  });

  // Reset form when page changes
  useState(() => {
    if (page) {
      form.reset(page);
    } else {
      form.reset({
        title: '',
        slug: '',
        content: '',
        meta_description: '',
        published: false
      });
    }
  });

  const onSubmit = async (data: StaticPage) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      if (page?.id) {
        // Update existing page
        const { error } = await supabase
          .from('static_pages')
          .update({
            title: data.title,
            slug: data.slug,
            content: data.content,
            meta_description: data.meta_description,
            published: data.published,
            last_updated_by: user.id
          })
          .eq('id', page.id);

        if (error) throw error;

        toast({
          title: 'Página atualizada',
          description: 'A página foi atualizada com sucesso!'
        });
      } else {
        // Create new page
        const { error } = await supabase
          .from('static_pages')
          .insert({
            title: data.title,
            slug: data.slug,
            content: data.content,
            meta_description: data.meta_description,
            published: data.published,
            last_updated_by: user.id
          });

        if (error) throw error;

        toast({
          title: 'Página criada',
          description: 'A página foi criada com sucesso!'
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: `Falha ao salvar página: ${error.message}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {page ? `Editar: ${page.title}` : 'Criar Nova Página'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Título da página" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug (URL)</FormLabel>
                    <FormControl>
                      <Input placeholder="slug-da-pagina" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="meta_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição para SEO" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo HTML</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Conteúdo HTML da página"
                      className="h-64 font-mono"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Publicado</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Tornar esta página visível ao público
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {page ? 'Atualizar' : 'Criar'} Página
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
