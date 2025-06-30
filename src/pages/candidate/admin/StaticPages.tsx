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
import {
  Loader2,
  PlusCircle,
  Eye,
  Pencil,
  Trash2,
  FileText,
  BookOpen,
  ShieldCheck,
  InfoIcon,
  MoreVertical
} from 'lucide-react';
import { CandidateSidebar } from '@/components/candidate/Sidebar';
import { CandidateHeader } from '@/components/candidate/Header';
import { useIsMobile } from '@/hooks/use-mobile';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TEMPLATE_PAGES = [
  {
    title: 'Sobre Nós',
    slug: 'sobre-nos',
    description: 'Informações sobre a empresa, missão, visão e valores',
    icon: InfoIcon,
    content: `<div class="max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Sobre Nós</h1>

    <section class="mb-10">
      <h2 class="text-2xl font-semibold mb-4">Nossa Missão</h2>
      <p class="text-gray-700 mb-4">
        Conectar profissionais da área de dados às melhores oportunidades do mercado, criando uma comunidade interativa
        e colaborativa para o desenvolvimento profissional contínuo.
      </p>
    </section>

    <section class="mb-10">
      <h2 class="text-2xl font-semibold mb-4">Nossa Visão</h2>
      <p class="text-gray-700 mb-4">
        Ser a principal plataforma para profissionais de dados no Brasil, reunindo talentos e empresas em um ecossistema
        que potencializa o crescimento mútuo e a evolução tecnológica.
      </p>
    </section>

    <section class="mb-10">
      <h2 class="text-2xl font-semibold mb-4">Nossos Valores</h2>
      <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong>Comunidade:</strong> Acreditamos no poder da colaboração e troca de conhecimentos.</li>
        <li><strong>Transparência:</strong> Promovemos relações claras entre candidatos e empresas.</li>
        <li><strong>Inovação:</strong> Buscamos constantemente novas formas de melhorar a experiência dos usuários.</li>
        <li><strong>Diversidade:</strong> Valorizamos diferentes perspectivas e experiências.</li>
        <li><strong>Excelência Técnica:</strong> Incentivamos o aperfeiçoamento contínuo.</li>
      </ul>
    </section>

    <section>
      <h2 class="text-2xl font-semibold mb-4">Nossa História</h2>
      <p class="text-gray-700 mb-4">
        Fundada em 2023, a plataforma surgiu da necessidade de um espaço dedicado exclusivamente aos profissionais
        da área de dados, que cresce exponencialmente no mercado brasileiro e global.
      </p>
      <p class="text-gray-700">
        Nosso diferencial está na combinação entre oportunidades de emprego e uma comunidade ativa,
        onde o networking e o aprendizado contínuo andam lado a lado com o desenvolvimento profissional.
      </p>
    </section>
  </div>`
  },
  {
    title: 'Termos de Uso',
    slug: 'termos-de-uso',
    description: 'Termos e condições de uso da plataforma',
    icon: FileText,
    content: `<div class="max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Termos de Uso</h1>

    <p class="text-gray-700 mb-6">
      Última atualização: [DATA]
    </p>

    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-3">1. Aceitação dos Termos</h2>
      <p class="text-gray-700 mb-3">
        Ao acessar e utilizar esta plataforma, você concorda em cumprir e estar vinculado a estes Termos de Uso.
        Se você não concordar com algum aspecto destes termos, não deverá utilizar nossos serviços.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-3">2. Descrição do Serviço</h2>
      <p class="text-gray-700 mb-3">
        Nossa plataforma oferece um ambiente digital para profissionais da área de dados se conectarem com
        oportunidades de emprego e participarem de uma comunidade interativa.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-3">3. Contas de Usuário</h2>
      <p class="text-gray-700 mb-3">
        3.1. Para utilizar nossos serviços, você precisa criar uma conta e fornecer informações precisas e atualizadas.
      </p>
      <p class="text-gray-700 mb-3">
        3.2. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades realizadas com sua conta.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-3">4. Conduta do Usuário</h2>
      <p class="text-gray-700 mb-3">
        4.1. Você concorda em não utilizar a plataforma para fins ilegais ou não autorizados.
      </p>
      <p class="text-gray-700 mb-3">
        4.2. É proibido publicar conteúdo que seja difamatório, obsceno, ameaçador ou que viole direitos de terceiros.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-3">5. Propriedade Intelectual</h2>
      <p class="text-gray-700 mb-3">
        5.1. Todo o conteúdo disponibilizado pela plataforma está protegido por direitos autorais e outras leis de propriedade intelectual.
      </p>
      <p class="text-gray-700 mb-3">
        5.2. Você não pode copiar, modificar, distribuir ou criar trabalhos derivados do nosso conteúdo sem autorização prévia.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-3">6. Limitação de Responsabilidade</h2>
      <p class="text-gray-700 mb-3">
        6.1. A plataforma é fornecida "como está", sem garantias de qualquer tipo.
      </p>
      <p class="text-gray-700 mb-3">
        6.2. Não seremos responsáveis por danos diretos, indiretos, incidentais ou consequenciais resultantes do uso da plataforma.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-3">7. Alterações nos Termos</h2>
      <p class="text-gray-700 mb-3">
        Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor
        imediatamente após sua publicação na plataforma.
      </p>
    </section>

    <section>
      <h2 class="text-xl font-semibold mb-3">8. Contato</h2>
      <p class="text-gray-700">
        Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco pelo e-mail: contato@exemplo.com
      </p>
    </section>
  </div>`
  },
  {
    title: 'Política de Privacidade',
    slug: 'politica-de-privacidade',
    description: 'Como coletamos e tratamos os dados dos usuários',
    icon: ShieldCheck,
    content: `<div class="max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Política de Privacidade</h1>

    <p class="text-gray-700 mb-6">
      Última atualização: [DATA]
    </p>

    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-3">1. Introdução</h2>
      <p class="text-gray-700 mb-3">
        Esta Política de Privacidade descreve como coletamos, usamos e compartilhamos suas informações pessoais
        quando você utiliza nossa plataforma.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-3">2. Informações Coletadas</h2>
      <p class="text-gray-700 mb-3">
        2.1. <strong>Informações da Conta:</strong> Nome, e-mail, senha e outras informações fornecidas durante o registro.
      </p>
      <p class="text-gray-700 mb-3">
        2.2. <strong>Informações do Perfil:</strong> Histórico profissional, habilidades, foto, links para redes sociais.
      </p>
      <p class="text-gray-700 mb-3">
        2.3. <strong>Dados de Uso:</strong> Informações sobre como você interage com nossa plataforma.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-3">3. Uso das Informações</h2>
      <p class="text-gray-700 mb-3">
        Utilizamos suas informações para:
      </p>
      <ul class="list-disc pl-5 space-y-2 text-gray-700 mb-3">
        <li>Fornecer, manter e melhorar nossos serviços;</li>
        <li>Personalizar sua experiência na plataforma;</li>
        <li>Conectar candidatos a oportunidades de emprego relevantes;</li>
        <li>Enviar atualizações e comunicações sobre a plataforma;</li>
        <li>Garantir a segurança e integridade de nossos serviços.</li>
      </ul>
    </section>

    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-3">4. Compartilhamento de Informações</h2>
      <p class="text-gray-700 mb-3">
        4.1. <strong>Empresas:</strong> Compartilhamos informações do seu perfil com empresas que oferecem vagas de emprego.
      </p>
      <p class="text-gray-700 mb-3">
        4.2. <strong>Prestadores de Serviço:</strong> Trabalhamos com terceiros que nos ajudam a operar a plataforma.
      </p>
      <p class="text-gray-700 mb-3">
        4.3. <strong>Requisitos Legais:</strong> Podemos divulgar informações quando exigido por lei.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-3">5. Segurança</h2>
      <p class="text-gray-700 mb-3">
        Implementamos medidas de segurança para proteger suas informações pessoais contra acesso não autorizado ou alteração.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-3">6. Seus Direitos</h2>
      <p class="text-gray-700 mb-3">
        Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Para exercer esses direitos,
        entre em contato conosco através dos canais fornecidos abaixo.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-3">7. Alterações nesta Política</h2>
      <p class="text-gray-700 mb-3">
        Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre alterações significativas
        por e-mail ou através de um aviso na plataforma.
      </p>
    </section>

    <section>
      <h2 class="text-xl font-semibold mb-3">8. Contato</h2>
      <p class="text-gray-700">
        Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco pelo e-mail: privacidade@exemplo.com
      </p>
    </section>
  </div>`
  }
];

export default function StaticPages() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [pages, setPages] = useState<StaticPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<StaticPage | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [deletePageId, setDeletePageId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const fetchPages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('static_pages')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      setPages(data);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro ao carregar páginas: ${errorMessage}`);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: `Falha ao carregar páginas: ${errorMessage}`,
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

  const handleCreateWithTemplate = (template: typeof TEMPLATE_PAGES[0]) => {
    // Verificar se já existe uma página com esse slug
    const existingPage = pages.find(page => page.slug === template.slug);

    if (existingPage) {
      setSelectedPage(existingPage);
    } else {
      setSelectedPage({
        id: '',
        title: template.title,
        slug: template.slug,
        content: template.content,
        meta_description: template.description,
        created_at: '',
        updated_at: '',
        published: false
      });
    }

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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: `Falha ao excluir página: ${errorMessage}`,
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

  // Filtrar páginas com base na aba selecionada
  const filteredPages = activeTab === 'all'
    ? pages
    : activeTab === 'published'
      ? pages.filter(page => page.published)
      : pages.filter(page => !page.published);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <CandidateHeader />
      <div className="flex">
        {!isMobile && <CandidateSidebar />}
        <main className="flex-1 p-3 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-xl md:text-2xl font-semibold">Páginas Estáticas</h1>
            <Button onClick={handleCreate} className="w-full sm:w-auto">
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Página
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
            {TEMPLATE_PAGES.map((template) => (
              <Card key={template.slug} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-3 pb-3">
                  <template.icon className="h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <CardTitle className="text-base md:text-lg truncate">{template.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm line-clamp-2">{template.description}</CardDescription>
                </CardContent>
                <CardFooter className="pt-3">
                  <Button
                    onClick={() => handleCreateWithTemplate(template)}
                    variant="outline"
                    className="w-full text-sm"
                    size="sm"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Editar conteúdo
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-3 md:px-4 pt-4">
                <TabsList className="grid w-full grid-cols-3 h-9 md:h-10">
                  <TabsTrigger value="all" className="text-xs md:text-sm">Todas</TabsTrigger>
                  <TabsTrigger value="published" className="text-xs md:text-sm">Publicadas</TabsTrigger>
                  <TabsTrigger value="drafts" className="text-xs md:text-sm">Rascunhos</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="all" className="m-0">
                {renderPagesTable(filteredPages)}
              </TabsContent>
              <TabsContent value="published" className="m-0">
                {renderPagesTable(filteredPages)}
              </TabsContent>
              <TabsContent value="drafts" className="m-0">
                {renderPagesTable(filteredPages)}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

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
        <AlertDialogContent className="mx-4 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta página?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel onClick={() => setDeletePageId(null)} className="w-full sm:w-auto">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600 w-full sm:w-auto"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  function renderPagesTable(pagesToDisplay: StaticPage[]) {
    if (loading) {
      return (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (pagesToDisplay.length === 0) {
      return (
        <div className="text-center py-8 px-4">
          <p className="text-muted-foreground text-sm md:text-base">Nenhuma página encontrada nesta categoria</p>
        </div>
      );
    }

    // Renderização mobile com cards
    if (isMobile) {
      return (
        <div className="p-3 space-y-3">
          {pagesToDisplay.map((page) => (
            <Card key={page.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-sm truncate">{page.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">/{page.slug}</p>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  {page.published ? (
                    <Badge variant="success" className="bg-green-500 text-xs">Publicada</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">Rascunho</Badge>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handlePreview(page)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(page)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeletePageId(page.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Atualizado: {formatDate(page.updated_at)}
              </p>
            </Card>
          ))}
        </div>
      );
    }

    // Renderização desktop com tabela
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Título</TableHead>
              <TableHead className="min-w-[120px]">Slug</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="min-w-[140px]">Atualizado</TableHead>
              <TableHead className="text-right min-w-[120px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagesToDisplay.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="font-medium">{page.title}</TableCell>
                <TableCell className="font-mono text-sm">/{page.slug}</TableCell>
                <TableCell>
                  {page.published ? (
                    <Badge variant="success" className="bg-green-500">Publicada</Badge>
                  ) : (
                    <Badge variant="secondary">Rascunho</Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm">{formatDate(page.updated_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
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
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}
