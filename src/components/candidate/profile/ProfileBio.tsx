import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfileBioProps {
  description: string;
  onDescriptionChange: (value: string) => void;
}

export function ProfileBio({ description, onDescriptionChange }: ProfileBioProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="description">Sobre Você</Label>
      <Textarea
        id="description"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Conte um pouco sobre sua experiência..."
        className="min-h-[100px]"
      />
    </div>
  );
}