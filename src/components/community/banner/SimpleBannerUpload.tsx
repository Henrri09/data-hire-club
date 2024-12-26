import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Upload } from "lucide-react";

interface SimpleBannerUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function SimpleBannerUpload({ open, onOpenChange, onSuccess }: SimpleBannerUploadProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Formato não suportado",
          description: "Por favor, use apenas imagens nos formatos JPG, PNG ou WebP",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        toast({
          title: "Arquivo muito grande",
          description: "O tamanho máximo permitido é 2MB",
          variant: "destructive",
        });
        return;
      }

      setIsUploading(true);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Upload to Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(fileName, file, {
          contentType: file.type,
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(fileName);

      // Create banner record
      const { error: insertError } = await supabase
        .from('community_banners')
        .insert([{
          image_url: publicUrl,
          created_by: user.id,
          is_active: true
        }]);

      if (insertError) throw insertError;

      toast({
        title: "Banner adicionado",
        description: "O banner foi enviado com sucesso",
      });

      onOpenChange(false);
      onSuccess?.();

    } catch (error) {
      console.error('Error uploading banner:', error);
      toast({
        title: "Erro ao enviar banner",
        description: "Ocorreu um erro ao tentar enviar o banner",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Banner</DialogTitle>
          <DialogDescription>
            Faça upload de uma imagem para o banner da comunidade
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-[#9b87f5]/40 rounded-lg p-12 text-center">
            <Upload className="h-10 w-10 text-[#9b87f5] mb-4" />
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Arraste sua imagem ou clique para selecionar</h3>
              <p className="text-sm text-gray-500">
                Formatos suportados: JPG, PNG, WebP
                <br />
                Tamanho máximo: 2MB
              </p>
            </div>
            <input
              type="file"
              onChange={handleFileUpload}
              accept="image/jpeg,image/png,image/webp"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              disabled={isUploading}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}