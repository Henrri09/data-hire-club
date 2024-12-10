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
    const file = event.target.files?.[0];
    if (file) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuário não autenticado");

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            onPreviewChange(reader.result);
          }
        };
        reader.readAsDataURL(file);

        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('avatars')
          .upload(fileName, file, { upsert: true });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        // Update profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ logo_url: publicUrl })
          .eq('id', user.id);

        if (updateError) throw updateError;

        onPhotoChange(publicUrl);

        toast({
          title: "Foto atualizada",
          description: "Sua foto de perfil foi atualizada com sucesso.",
        });
      } catch (error) {
        console.error('Error uploading photo:', error);
        toast({
          title: "Erro ao atualizar foto",
          description: "Ocorreu um erro ao tentar atualizar sua foto de perfil.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold">Foto do Perfil</Label>
      <div className="flex items-center justify-center">
        <div className="relative w-32 h-32 group cursor-pointer">
          {currentPhotoUrl ? (
            <img
              src={currentPhotoUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded-full border-4 border-[#9b87f5]/20"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-[#E5DEFF] flex items-center justify-center border-4 border-[#9b87f5]/20">
              <Upload className="w-8 h-8 text-[#9b87f5]/60" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -bottom-2 right-0 bg-[#9b87f5] rounded-full p-1.5 shadow-lg border-2 border-white">
            <Upload className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}