import { useEffect, useState } from "react";
import { CandidateHeader } from "@/components/candidate/Header";
import { CandidateSidebar } from "@/components/candidate/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import supabase from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddScriptDialog } from "@/components/community/admin/seo/AddScriptDialog";

interface ExternalScript {
  id: string;
  name: string;
  script_type: 'GA' | 'GTM' | 'META_PIXEL';
  tracking_id: string;
  is_active: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
  deleted_at: string | null;
}

const scriptTypeLabels = {
  GA: 'Google Analytics 4',
  GTM: 'Google Tag Manager',
  META_PIXEL: 'Meta Pixel'
};

export default function SEOScripts() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [scripts, setScripts] = useState<ExternalScript[]>([]);
  const [isAddScriptOpen, setIsAddScriptOpen] = useState(false);

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

    // Filter out any scripts with type 'OTHER' to match our interface
    const validScripts = data?.filter(script =>
      ['GA', 'GTM', 'META_PIXEL'].includes(script.script_type)
    ) as ExternalScript[];

    setScripts(validScripts || []);
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
                <CardTitle>Traqueamento</CardTitle>
                <Button
                  className="bg-[#7779f5] hover:bg-[#7779f5]/90"
                  onClick={() => setIsAddScriptOpen(true)}
                >
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
                      <TableHead>ID de Rastreamento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criado em</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scripts.map((script) => (
                      <TableRow key={script.id}>
                        <TableCell>{script.name}</TableCell>
                        <TableCell>{scriptTypeLabels[script.script_type]}</TableCell>
                        <TableCell>{script.tracking_id}</TableCell>
                        <TableCell>
                          <Switch
                            checked={script.is_active}
                            onCheckedChange={() => toggleScriptStatus(script.id, script.is_active)}
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(script.created_at).toLocaleDateString()}
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

      <AddScriptDialog
        open={isAddScriptOpen}
        onOpenChange={setIsAddScriptOpen}
        onSuccess={fetchScripts}
      />
    </div>
  );
}