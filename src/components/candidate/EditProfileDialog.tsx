import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import supabase from "@/integrations/supabase/client";
import { useToast } from "../ui/use-toast";
import { PhotoUploadField } from "./profile/PhotoUploadField";
import { SkillsInput } from "./profile/SkillsInput";
import { ProfileBasicInfo } from "./profile/ProfileBasicInfo";
import { ProfileLinks } from "./profile/ProfileLinks";
import { ProfileBio } from "./profile/ProfileBio";

interface Profile {
  description: string;
  skills: string[];
  photoUrl: string | null;
  full_name: string | null;
  headline: string | null;
  location: string | null;
  experience_level: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
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
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
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

      console.log('Carregando perfil do usuário:', user.id);

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('logo_url, full_name, location, linkedin_url')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erro ao carregar perfil:', error);
        throw error;
      }

      const { data: candidate, error: candidateError } = await supabase
        .from('candidates')
        .select('bio, skills, headline, experience_level, github_url, portfolio_url')
        .eq('profile_id', user.id)
        .single();

      console.log('Perfil carregado:', profile);

      if (profile) {
        setDescription(candidate.bio || "");
        setFullName(profile.full_name || "");
        setHeadline(candidate.headline || "");
        setLocation(profile.location || "");
        setExperienceLevel(candidate.experience_level || "");
        setLinkedinUrl(profile.linkedin_url || "");
        setGithubUrl(candidate.github_url || "");
        setPortfolioUrl(candidate.portfolio_url || "");
        setSkills(Array.isArray(candidate.skills) ? candidate.skills.map(String) : []);
        setPhotoUrl(profile.logo_url);
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

      const updatesProfile = {
        id: user.id,
        logo_url: photoUrl,
        full_name: fullName,
        location: location,
        linkedin_url: linkedinUrl,
        updated_at: new Date().toISOString(),
      };

      const updatesCandidate = {
        bio: description,
        skills: skills,
        headline: headline,
        experience_level: experienceLevel,
        github_url: githubUrl,
        portfolio_url: portfolioUrl,
      };

      const { error } = await supabase
        .from('profiles')
        .update(updatesProfile)
        .eq('id', user.id);

      if (error) {
        console.error('Erro ao salvar perfil:', error);
        throw error;
      }

      console.log('Perfil atualizado com sucesso');

      const { error: candidateError } = await supabase
        .from('candidates')
        .update(updatesCandidate)
        .eq('profile_id', user.id);

      if (candidateError) {
        console.error('Erro ao salvar perfil:', candidateError);
        throw candidateError;
      }

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso",
      });

      onProfileUpdate({
        description,
        skills,
        photoUrl,
        full_name: fullName,
        headline,
        location,
        experience_level: experienceLevel,
        linkedin_url: linkedinUrl,
        github_url: githubUrl,
        portfolio_url: portfolioUrl
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
        <div className="grid gap-6 py-4">
          <PhotoUploadField
            currentPhotoUrl={photoUrl}
            onPhotoChange={setPhotoUrl}
          />

          <ProfileBasicInfo
            fullName={fullName}
            headline={headline}
            location={location}
            experienceLevel={experienceLevel}
            onFullNameChange={setFullName}
            onHeadlineChange={setHeadline}
            onLocationChange={setLocation}
            onExperienceLevelChange={setExperienceLevel}
          />

          <ProfileBio
            description={description}
            onDescriptionChange={setDescription}
          />

          <div className="grid gap-2">
            <SkillsInput
              skills={skills}
              onSkillsChange={setSkills}
            />
          </div>

          <ProfileLinks
            linkedinUrl={linkedinUrl}
            githubUrl={githubUrl}
            portfolioUrl={portfolioUrl}
            onLinkedinUrlChange={setLinkedinUrl}
            onGithubUrlChange={setGithubUrl}
            onPortfolioUrlChange={setPortfolioUrl}
          />
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