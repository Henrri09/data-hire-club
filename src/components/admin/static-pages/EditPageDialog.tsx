
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StaticPage } from '@/types/staticPage.types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Eye } from 'lucide-react';

interface EditPageDialogProps {
  page: StaticPage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditPageDialog({ page, open, onOpenChange, onSuccess }: EditPageDialogProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("content");
  const [previewContent, setPreviewContent] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<StaticPage>({
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      meta_description: '',
      published: false
    }
  });

  // Reset form when page changes or dialog opens
  useEffect(() => {
    if (page) {
      form.reset(page);
      setPreviewContent(page.content);
    } else {
      form.reset({
        title: '',
        slug: '',
        content: '',
        meta_description: '',
        published: false
      });
      setPreviewContent("");
    }
  }, [page, open, form]);

  // Update preview when content changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.content) {
        setPreviewContent(value.content);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  // Helper to generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('title', title);
    
    // Apenas gera o slug automaticamente se for uma nova página ou se o slug estiver vazio
    if (!page?.id || !form.getValues('slug')) {
      form.setValue('slug', generateSlug(title));
    }
  };

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
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
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
                      <Input 
                        placeholder="Título da página" 
                        {...field} 
                        onChange={(e) => handleTitleChange(e)}
                      />
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
                    <FormDescription>
                      URL da página (ex: /sobre-nos)
                    </FormDescription>
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
                  <FormDescription>
                    Breve descrição para motores de busca (SEO)
                  </FormDescription>
                </FormItem>
              )}
            />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="content">Editor</TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" /> Visualizar
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="p-0 border rounded-md mt-2">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Conteúdo HTML da página"
                          className="min-h-[400px] font-mono border-0 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="px-3 pb-2">
                        Use HTML para formatar o conteúdo. Exemplo: &lt;h1&gt;Título&lt;/h1&gt;, &lt;p&gt;Parágrafo&lt;/p&gt;
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="preview" className="border rounded-md p-4 min-h-[400px] mt-2">
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: previewContent }} />
                </div>
              </TabsContent>
            </Tabs>

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Publicado</FormLabel>
                    <FormDescription>
                      Tornar esta página visível ao público
                    </FormDescription>
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
