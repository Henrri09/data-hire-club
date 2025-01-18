import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProfileBasicInfoProps {
  fullName: string;
  headline: string;
  location: string;
  experienceLevel: string;
  companyName?: string;
  userType?: string;
  onFullNameChange: (value: string) => void;
  onHeadlineChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onExperienceLevelChange: (value: string) => void;
  onCompanyNameChange?: (value: string) => void;
}

export function ProfileBasicInfo({
  fullName,
  headline,
  location,
  experienceLevel,
  companyName,
  userType,
  onFullNameChange,
  onHeadlineChange,
  onLocationChange,
  onExperienceLevelChange,
  onCompanyNameChange,
}: ProfileBasicInfoProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          placeholder="Seu nome completo"
        />
      </div>

      {userType === 'company' && onCompanyNameChange && (
        <div className="grid gap-2">
          <Label htmlFor="companyName">Nome da Empresa</Label>
          <Input
            id="companyName"
            value={companyName}
            onChange={(e) => onCompanyNameChange(e.target.value)}
            placeholder="Nome da sua empresa"
          />
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="headline">Título Profissional</Label>
        <Input
          id="headline"
          value={headline}
          onChange={(e) => onHeadlineChange(e.target.value)}
          placeholder="Ex: Analista de Dados Senior"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="location">Localização</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          placeholder="Ex: São Paulo, SP"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="experience">Nível de Experiência</Label>
        <Select value={experienceLevel} onValueChange={onExperienceLevelChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione seu nível de experiência" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="junior">Júnior (0-2 anos)</SelectItem>
            <SelectItem value="pleno">Pleno (2-5 anos)</SelectItem>
            <SelectItem value="senior">Sênior (5+ anos)</SelectItem>
            <SelectItem value="specialist">Especialista/Tech Lead</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}