import { Upload } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LogoUploadProps {
  currentLogoUrl: string | null;
  onLogoChange: (url: string) => void;
}

export function LogoUpload({ currentLogoUrl, onLogoChange }: LogoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: "Tipo de arquivo inválido",
          description: "Por favor, selecione apenas imagens.",
        });
        return;
      }

      setIsUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      onLogoChange(publicUrl);
      
      toast({
        title: "Logo atualizado",
        description: "O logo da empresa foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: "Não foi possível fazer upload do logo.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative w-32 h-32 group cursor-pointer">
      <label htmlFor="logo-upload" className="block w-full h-full cursor-pointer">
        {currentLogoUrl ? (
          <img
            src={currentLogoUrl}
            alt="Logo da empresa"
            className="w-full h-full object-cover rounded-lg border-2 border-[#7779f5]/20"
          />
        ) : (
          <div className="w-full h-full rounded-lg bg-[#E5DEFF] flex items-center justify-center border-2 border-[#7779f5]/20">
            <Upload className="w-8 h-8 text-[#7779f5]/60" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Upload className="w-6 h-6 text-white" />
        </div>
      </label>
      <input
        id="logo-upload"
        type="file"
        accept="image/*"
        onChange={handleLogoUpload}
        disabled={isUploading}
        className="hidden"
      />
    </div>
  );
}