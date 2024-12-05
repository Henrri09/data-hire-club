import { useState } from "react";
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
                      className="w-full h-full object-cover rounded-full border-4 border-[#9b87f5]/20"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#E5DEFF] flex items-center justify-center border-4 border-[#9b87f5]/20">
                      <Upload className="w-12 h-12 text-[#9b87f5]/60" />
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
              className="w-full bg-[#9b87f5] hover:bg-[#9b87f5]/90 text-white py-6 text-lg font-semibold"
            >
              Salvar Alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}