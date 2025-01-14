import { useEffect, useState } from "react";
import { CandidateHeader } from "@/components/candidate/Header";
import { CandidateSidebar } from "@/components/candidate/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ExternalScript {
  id: string;
  name: string;
  script_content: string;
  script_type: 'GA' | 'GTM' | 'META_PIXEL' | 'OTHER';
  is_active: boolean;
  created_at: string;
}

export default function SEOScripts() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [scripts, setScripts] = useState<ExternalScript[]>([]);

  useEffect(() => {
    fetchScripts();
  }, []);

  const fetchScripts = async () => {
    const { data, error } = await supabase
      .from('external_scripts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Erro ao carregar scripts",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setScripts(data || []);
  };

  const toggleScriptStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('external_scripts')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    fetchScripts();
    toast({
      title: "Status atualizado",
      description: "O status do script foi atualizado com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <CandidateHeader />
      <div className="flex">
        {!isMobile && <CandidateSidebar />}
        <main className="flex-1 py-6 px-4 md:py-8 md:px-8">
          <div className="max-w-5xl mx-auto space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Scripts SEO</CardTitle>
                <Button className="bg-[#7779f5] hover:bg-[#7779f5]/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Script
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scripts.map((script) => (
                      <TableRow key={script.id}>
                        <TableCell>{script.name}</TableCell>
                        <TableCell>{script.script_type}</TableCell>
                        <TableCell>
                          <Switch
                            checked={script.is_active}
                            onCheckedChange={() => toggleScriptStatus(script.id, script.is_active)}
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(script.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}