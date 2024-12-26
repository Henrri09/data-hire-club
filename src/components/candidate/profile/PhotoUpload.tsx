import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";

interface PhotoUploadProps {
  currentPhotoUrl: string | null;
  onPhotoChange: (url: string) => void;
  onPreviewChange: (url: string | null) => void;
}

export function PhotoUpload({ currentPhotoUrl, onPhotoChange, onPreviewChange }: PhotoUploadProps) {
  const { toast } = useToast();

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validar o tipo do arquivo
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erro no upload",
          description: "Por favor, selecione apenas arquivos de imagem.",
          variant: "destructive",
        });
        return;
      }

      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onPreviewChange(reader.result);
        }
      };
      reader.readAsDataURL(file);

      // Upload para o Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).slice(2)}_${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(`public/${fileName}`, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(`public/${fileName}`);
      
      onPhotoChange(publicUrl);
      
      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      toast({
        title: "Erro ao atualizar foto",
        description: "Ocorreu um erro ao tentar atualizar sua foto de perfil.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold">Foto do Perfil</Label>
      <div className="flex items-center justify-center">
        <div className="relative w-24 h-24 group cursor-pointer">
          {currentPhotoUrl ? (
            <img
              src={currentPhotoUrl}
              alt="Preview"
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