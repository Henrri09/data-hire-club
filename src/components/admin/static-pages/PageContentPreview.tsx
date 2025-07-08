
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StaticPage } from '@/types/staticPage.types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface PageContentPreviewProps {
  page: StaticPage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PageContentPreview({ page, open, onOpenChange }: PageContentPreviewProps) {
  const [activeTab, setActiveTab] = useState<string>("preview");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex flex-col">
            <DialogTitle>{page.title}</DialogTitle>
            <div className="text-sm text-muted-foreground mt-1">
              Slug: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800">{page.slug}</code>
            </div>
          </div>
          <div>
            {page.published ? (
              <Badge variant="success" className="bg-green-500">Publicada</Badge>
            ) : (
              <Badge variant="secondary">Rascunho</Badge>
            )}
          </div>
        </DialogHeader>

        <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Visualização</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="mt-4 min-h-[300px] border rounded-md p-6">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </TabsContent>
          <TabsContent value="html" className="mt-4 min-h-[300px]">
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm font-mono">
              <code>{page.content}</code>
            </pre>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-4">
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
