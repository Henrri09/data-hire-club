import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, Link } from "lucide-react";

interface ProfileHeaderProps {
  profile: {
    full_name: string | null;
    headline: string | null;
    photoUrl: string | null;
    skills: string[];
    location: string | null;
    experience_level: string | null;
    linkedin_url: string | null;
    github_url: string | null;
    portfolio_url: string | null;
    description: string | null;
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

  const formatExperienceLevel = (level: string | null) => {
    if (!level) return null;
    const levels: { [key: string]: string } = {
      junior: "Júnior (0-2 anos)",
      pleno: "Pleno (2-5 anos)",
      senior: "Sênior (5+ anos)",
      specialist: "Especialista/Tech Lead"
    };
    return levels[level] || level;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
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
          <p className="text-gray-600 mt-1">{profile.headline || "Adicione sua profissão"}</p>
          
          <div className="flex flex-wrap gap-3 mt-3">
            {profile.location && (
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                {profile.location}
              </div>
            )}
            {profile.experience_level && (
              <div className="flex items-center text-gray-600 text-sm">
                <Briefcase className="h-4 w-4 mr-1" />
                {formatExperienceLevel(profile.experience_level)}
              </div>
            )}
          </div>
        </div>
        <Button 
          onClick={onEditClick}
          className="bg-[#9b87f5] hover:bg-[#9b87f5]/90"
        >
          Editar Perfil
        </Button>
      </div>

      {profile.description && (
        <p className="text-gray-600 text-sm">{profile.description}</p>
      )}

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

      <div className="flex flex-wrap gap-3">
        {profile.linkedin_url && (
          <a 
            href={profile.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-[#9b87f5] hover:text-[#9b87f5]/80"
          >
            <Link className="h-4 w-4 mr-1" />
            LinkedIn
          </a>
        )}
        {profile.github_url && (
          <a 
            href={profile.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-[#9b87f5] hover:text-[#9b87f5]/80"
          >
            <Link className="h-4 w-4 mr-1" />
            GitHub
          </a>
        )}
        {profile.portfolio_url && (
          <a 
            href={profile.portfolio_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-[#9b87f5] hover:text-[#9b87f5]/80"
          >
            <Link className="h-4 w-4 mr-1" />
            Portfolio
          </a>
        )}
      </div>
    </div>
  );
}