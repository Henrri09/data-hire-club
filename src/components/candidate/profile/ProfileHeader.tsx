import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProfileHeaderProps {
  profile: {
    full_name: string | null;
    headline: string | null;
    photoUrl: string | null;
    skills: string[];
  };
  onEditClick: () => void;
}

export function ProfileHeader({ profile, onEditClick }: ProfileHeaderProps) {
  const getInitials = (name: string | null) => {
    if (!name) return "";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile.photoUrl || undefined} />
          <AvatarFallback className="bg-[#9b87f5] text-white text-xl">
            {getInitials(profile.full_name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900">
            {profile.full_name || "Complete seu perfil"}
          </h3>
          <p className="text-gray-600">{profile.headline || "Adicione sua profissão"}</p>
        </div>
        <Button 
          onClick={onEditClick}
          className="bg-[#9b87f5] hover:bg-[#9b87f5]/90"
        >
          Editar Perfil
        </Button>
      </div>

      {profile.skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <Badge 
              key={skill}
              variant="secondary"
              className="bg-[#9b87f5]/10 text-[#9b87f5] hover:bg-[#9b87f5]/20"
            >
              {skill}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}