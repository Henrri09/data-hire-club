
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import supabase from '@/integrations/supabase/client';
import { StaticPage } from '@/types/staticPage.types';
import { Button } from '@/components/ui/button';
import { EditPageDialog } from '@/components/admin/static-pages/EditPageDialog';
import { PageContentPreview } from '@/components/admin/static-pages/PageContentPreview';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, PlusCircle, Eye, Pencil, Trash2 } from 'lucide-react';
import { CandidateSidebar } from '@/components/candidate/Sidebar';
import { CandidateHeader } from '@/components/candidate/Header';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

export default function StaticPages() {
  const [pages, setPages] = useState<StaticPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<StaticPage | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [deletePageId, setDeletePageId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('static_pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setPages(data);
      setError(null);
    } catch (err: any) {
      setError(`Erro ao carregar páginas: ${err.message}`);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: `Falha ao carregar páginas: ${err.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleEdit = (page: StaticPage) => {
    setSelectedPage(page);
    setIsEditDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedPage(null);
    setIsEditDialogOpen(true);
  };

  const handlePreview = (page: StaticPage) => {
    setSelectedPage(page);
    setIsPreviewDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletePageId) return;
    
    try {
      const { error } = await supabase
        .from('static_pages')
        .delete()
        .eq('id', deletePageId);
      
      if (error) throw error;
      
      toast({
        title: 'Página excluída',
        description: 'A página foi excluída com sucesso'
      });
      
      fetchPages();
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: `Falha ao excluir página: ${err.message}`,
      });
    } finally {
      setDeletePageId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <CandidateSidebar />
      <div className="flex-1 pl-64">
        <CandidateHeader />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Páginas Estáticas</h1>
            <Button onClick={handleCreate}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Página
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Atualizado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Nenhuma página encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    pages.map((page) => (
                      <TableRow key={page.id}>
                        <TableCell className="font-medium">{page.title}</TableCell>
                        <TableCell>{page.slug}</TableCell>
                        <TableCell>
                          {page.published ? (
                            <Badge variant="success">Publicada</Badge>
                          ) : (
                            <Badge variant="secondary">Rascunho</Badge>
                          )}
                        </TableCell>
                        <TableCell>{formatDate(page.updated_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePreview(page)}
                              title="Visualizar"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(page)}
                              title="Editar"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title="Excluir"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir a página "{page.title}"?
                                    Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => setDeletePageId(page.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </main>

        {selectedPage && isPreviewDialogOpen && (
          <PageContentPreview
            page={selectedPage}
            open={isPreviewDialogOpen}
            onOpenChange={setIsPreviewDialogOpen}
          />
        )}

        <EditPageDialog
          page={selectedPage}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={fetchPages}
        />

        <AlertDialog open={!!deletePageId} onOpenChange={(open) => !open && setDeletePageId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta página?
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeletePageId(null)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-500 hover:bg-red-600"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
