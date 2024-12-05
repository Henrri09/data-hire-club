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

// Interface para o perfil do usuário
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

  // Calcula a porcentagem de completude do perfil
  const calculateCompletion = () => {
    let completed = 0;
    const total = 3; // Total de critérios (foto, descrição > 200 palavras, 5+ habilidades)

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
    
    toast({
      title: "Perfil atualizado",
      description: `Seu perfil está ${completionPercentage}% completo.`,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Editar Perfil</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Foto</Label>
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32 group">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-full border-4 border-primary/20"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center border-4 border-primary/20">
                    <Upload className="w-8 h-8 text-primary/60" />
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
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="description">Descrição</Label>
              <span className="text-sm text-gray-500">
                {description.length}/200 caracteres mínimos
              </span>
            </div>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Fale um pouco sobre você..."
              className="min-h-[120px]"
            />
            {description.length >= 200 && (
              <div className="flex items-center gap-1 text-sm text-green-600">
                <Check className="w-4 h-4" />
                Descrição completa
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="skills">Habilidades</Label>
              <span className="text-sm text-gray-500">
                {skills.length}/5 habilidades mínimas
              </span>
            </div>
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="Digite uma habilidade e pressione Enter"
              className="w-full px-3 py-2 border rounded-md"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill) => (
                <Badge 
                  key={skill}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  {skill}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                    onClick={() => handleRemoveSkill(skill)}
                  />
                </Badge>
              ))}
            </div>
            {skills.length >= 5 && (
              <div className="flex items-center gap-1 text-sm text-green-600">
                <Check className="w-4 h-4" />
                Número mínimo de habilidades atingido
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Progresso do perfil</Label>
            <Progress value={completionPercentage} className="h-2" />
            <p className="text-sm text-gray-500 text-center">
              Seu perfil está {completionPercentage}% completo
            </p>
          </div>

          <Button 
            onClick={handleSave} 
            className="w-full bg-primary hover:bg-primary/90"
          >
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}