import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
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
  full_name: string | null;
  headline: string | null;
}

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProfileUpdate: (profile: Profile) => void;
}

export function EditProfileDialog({
  open,
  onOpenChange,
  onProfileUpdate,
}: EditProfileDialogProps) {
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadProfile();
    }
  }, [open]);

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
        setSkills(Array.isArray(profile.skills) ? profile.skills.map(String) : []);
        setPhotoUrl(profile.logo_url);
        setPhotoPreview(profile.logo_url);
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

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro ao salvar perfil",
          description: "Usuário não autenticado",
          variant: "destructive",
        });
        return;
      }

      const updates = {
        id: user.id,
        bio: description,
        skills: skills,
        logo_url: photoUrl,
        full_name: fullName,
        headline: headline,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      onProfileUpdate({
        description,
        skills,
        photoUrl,
        full_name: fullName,
        headline,
      });

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso",
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast({
        title: "Erro ao salvar perfil",
        description: "Ocorreu um erro ao salvar suas informações",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <PhotoUpload
            currentPhotoUrl={photoPreview}
            onPhotoChange={setPhotoUrl}
            onPreviewChange={setPhotoPreview}
          />
          <div className="grid gap-2">
            <label htmlFor="name">Nome Completo</label>
            <Input
              id="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Seu nome completo"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="headline">Título Profissional</label>
            <Input
              id="headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Ex: Analista de Dados Senior"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description">Sobre Você</label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Conte um pouco sobre sua experiência..."
              className="min-h-[100px]"
            />
          </div>
          <div className="grid gap-2">
            <label>Habilidades</label>
            <SkillsInput
              skills={skills}
              onSkillsChange={setSkills}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}