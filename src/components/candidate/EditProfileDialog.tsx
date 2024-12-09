import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "../ui/use-toast";
import { PhotoUpload } from "./profile/PhotoUpload";
import { SkillsInput } from "./profile/SkillsInput";

interface Profile {
  description: string;
  skills: string[];
  photoUrl: string | null;
  full_name?: string | null;
  headline?: string | null;
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
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: "Erro ao carregar perfil",
            description: "Usuário não autenticado",
            variant: "destructive",
          });
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('bio, skills, logo_url, full_name, headline')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (profile) {
          setDescription(profile.bio || "");
          setFullName(profile.full_name || "");
          setHeadline(profile.headline || "");
          setSkills(Array.isArray(profile.skills) ? profile.skills : []);
          setPhotoPreview(profile.logo_url || null);
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        toast({
          title: "Erro ao carregar perfil",
          description: "Ocorreu um erro ao carregar suas informações",
          variant: "destructive",
        });
      }
    };

    if (open) {
      loadProfile();
    }
  }, [open, toast]);

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
          full_name: fullName,
          headline: headline,
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
        full_name: fullName,
        headline: headline
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
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
              <Label className="text-lg font-semibold">Nome Completo</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome completo"
                className="focus:ring-2 focus:ring-[#9b87f5]/50 focus:border-[#9b87f5]"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-semibold">Profissão</Label>
              <Input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Ex: Engenheiro de Dados, Cientista de Dados..."
                className="focus:ring-2 focus:ring-[#9b87f5]/50 focus:border-[#9b87f5]"
              />
            </div>

            <PhotoUpload 
              photoPreview={photoPreview}
              onPhotoUpdate={setPhotoPreview}
            />
            <SkillsInput 
              skills={skills}
              onSkillsChange={setSkills}
            />
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