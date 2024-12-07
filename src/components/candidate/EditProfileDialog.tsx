import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "../ui/use-toast";

interface Profile {
  description: string;
  skills: string[];
  photoUrl: string | null;
}

export function EditProfileDialog({ 
  open, 
  onOpenChange,
  onProfileUpdate 
}: { 
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProfileUpdate: (profile: Profile) => void;
}) {
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setDescription(profile.bio || "");
          setSkills(profile.skills || []);
          setPhotoPreview(profile.avatar_url || null);
        }
      }
    };

    if (open) {
      loadProfile();
    }
  }, [open]);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuário não autenticado");

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreview(reader.result as string);
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
          .update({ avatar_url: publicUrl })
          .eq('id', user.id);

        if (updateError) throw updateError;

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

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      if (!skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()]);
      }
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from('profiles')
        .update({
          bio: description,
          skills: skills,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });

      onProfileUpdate({
        description,
        skills,
        photoUrl: photoPreview,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao tentar salvar suas informações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Editar Perfil</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Foto do Perfil</Label>
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32 group cursor-pointer">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
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

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-semibold">Habilidades</Label>
                <span className="text-sm text-gray-500">
                  {skills.length}/5 mínimo
                </span>
              </div>
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Digite uma habilidade e pressione Enter"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#9b87f5]/50 focus:border-[#9b87f5]"
              />
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge 
                    key={skill}
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#9b87f5]/10 text-[#9b87f5] hover:bg-[#9b87f5]/20"
                  >
                    {skill}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-500"
                      onClick={() => handleRemoveSkill(skill)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-semibold">Descrição</Label>
                <span className="text-sm text-gray-500">
                  {description.length}/200 caracteres mínimos
                </span>
              </div>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Fale um pouco sobre você..."
                className="min-h-[240px] resize-none focus:ring-2 focus:ring-[#9b87f5]/50 focus:border-[#9b87f5]"
              />
            </div>
            
            <Button 
              onClick={handleSave}
              disabled={isLoading}
              className="w-full bg-[#9b87f5] hover:bg-[#9b87f5]/90 text-white py-6 text-lg font-semibold"
            >
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}