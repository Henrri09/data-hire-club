import { useState, useEffect } from "react";
import { X, Upload, Check } from "lucide-react";
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
import { Progress } from "../ui/progress";
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
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const { toast } = useToast();

  const calculateCompletion = () => {
    let completed = 0;
    const total = 3;

    if (photoPreview) completed++;
    if (description.length >= 200) completed++;
    if (skills.length >= 5) completed++;

    return Math.round((completed / total) * 100);
  };

  useEffect(() => {
    const percentage = calculateCompletion();
    setCompletionPercentage(percentage);
  }, [description, skills, photoPreview]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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

  const handleSave = () => {
    const profile = {
      description,
      skills,
      photoUrl: photoPreview
    };

    onProfileUpdate(profile);
    onOpenChange(false);
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
                <div className="relative w-40 h-40 group">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-full border-4 border-primary/20"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center border-4 border-primary/20">
                      <Upload className="w-12 h-12 text-primary/60" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="w-12 h-12 text-white" />
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
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge 
                    key={skill}
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20"
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
                className="min-h-[240px] resize-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>

            <Progress value={completionPercentage} className="h-2 bg-primary/20" />
            
            <Button 
              onClick={handleSave} 
              className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold"
            >
              Salvar Alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}