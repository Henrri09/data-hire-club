import { useState } from "react";
import { Upload } from "lucide-react";
import supabase from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
      if (!file) {
        toast({
          title: "Erro no upload",
          description: "Nenhum arquivo selecionado.",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Tipo de arquivo inválido",
          description: "Por favor, selecione apenas imagens.",
          variant: "destructive",
        });
        return;
      }

      setIsUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      console.log('Iniciando upload do arquivo:', fileName);

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      console.log('URL pública obtida:', publicUrl);
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
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative w-24 h-24 mx-auto cursor-pointer">
        <label htmlFor="photo-upload" className="block w-full h-full cursor-pointer">
          <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#9b87f5]/20">
            {currentPhotoUrl ? (
              <img
                src={currentPhotoUrl}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#E5DEFF] flex items-center justify-center">
                <Upload className="w-6 h-6 text-[#9b87f5]/60" />
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <Upload className="w-6 h-6 text-white" />
          </div>
        </label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          disabled={isUploading}
          className="hidden"
        />
      </div>
    </div>
  );
}