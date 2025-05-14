
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StaticPage } from '@/types/staticPage.types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PageContentPreviewProps {
  page: StaticPage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PageContentPreview({ page, open, onOpenChange }: PageContentPreviewProps) {
  const [activeTab, setActiveTab] = useState<string>("preview");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{page.title}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Visualização</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="mt-4 min-h-[300px]">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </TabsContent>
          <TabsContent value="html" className="mt-4 min-h-[300px]">
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
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
