import { useState } from "react";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface SkillsInputProps {
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
}

export function SkillsInput({ skills, onSkillsChange }: SkillsInputProps) {
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      if (!skills.includes(newSkill.trim())) {
        onSkillsChange([...skills, newSkill.trim()]);
      }
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onSkillsChange(skills.filter(skill => skill !== skillToRemove));
  };

  return (
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
  );
}