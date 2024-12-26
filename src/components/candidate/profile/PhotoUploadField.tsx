import { useState } from "react";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PhotoUploadFieldProps {
  currentPhotoUrl: string | null;
  onPhotoChange: (url: string) => void;
}

export function PhotoUploadField({ currentPhotoUrl, onPhotoChange }: PhotoUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validar o tipo do arquivo
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Tipo de arquivo inválido",
          description: "Por favor, selecione apenas imagens.",
          variant: "destructive",
        });
        return;
      }

      setIsUploading(true);

      // Criar preview imediato
      const previewUrl = URL.createObjectURL(file);
      onPhotoChange(previewUrl);

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      console.log('Iniciando upload:', fileName);

      // Upload para o bucket 'avatars'
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        throw uploadError;
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      console.log('Upload concluído, URL:', publicUrl);

      onPhotoChange(publicUrl);
      
      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });

    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: "Ocorreu um erro ao fazer upload da foto.",
        variant: "destructive",
      });
      // Reverter para a foto anterior em caso de erro
      onPhotoChange(currentPhotoUrl || '');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        <div className="relative w-24 h-24 group cursor-pointer">
          {currentPhotoUrl ? (
            <img
              src={currentPhotoUrl}
              alt="Foto de perfil"
              className="w-full h-full object-cover rounded-full border-4 border-[#9b87f5]/20"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-[#E5DEFF] flex items-center justify-center border-4 border-[#9b87f5]/20">
              <Upload className="w-6 h-6 text-[#9b87f5]/60" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -bottom-1 right-0 bg-[#9b87f5] rounded-full p-1.5 shadow-lg border-2 border-white">
            <Upload className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}