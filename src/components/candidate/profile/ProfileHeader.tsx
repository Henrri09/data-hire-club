import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProfileHeaderProps {
  profile: {
    full_name: string | null;
    headline: string | null;
    location: string | null;
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
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">
          {profile.full_name || "Complete seu perfil"}
        </h3>
        <p className="text-gray-600">{profile.headline || "Adicione seu cargo atual"}</p>
        
        <div className="flex flex-col md:flex-row gap-3 text-gray-500 text-sm">
          {profile.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {profile.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Briefcase className="w-4 h-4" />
            Disponível para propostas
          </span>
        </div>
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

      <div className="text-center mt-4">
        <Button 
          onClick={onEditClick}
          className="w-full md:w-auto"
        >
          Editar Perfil
        </Button>
      </div>
    </div>
  );
}