import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileLinksProps {
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  onLinkedinUrlChange: (value: string) => void;
  onGithubUrlChange: (value: string) => void;
  onPortfolioUrlChange: (value: string) => void;
}

export function ProfileLinks({
  linkedinUrl,
  githubUrl,
  portfolioUrl,
  onLinkedinUrlChange,
  onGithubUrlChange,
  onPortfolioUrlChange,
}: ProfileLinksProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="linkedin">LinkedIn URL</Label>
        <Input
          id="linkedin"
          value={linkedinUrl}
          onChange={(e) => onLinkedinUrlChange(e.target.value)}
          placeholder="https://linkedin.com/in/seu-perfil"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="github">GitHub URL</Label>
        <Input
          id="github"
          value={githubUrl}
          onChange={(e) => onGithubUrlChange(e.target.value)}
          placeholder="https://github.com/seu-usuario"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="portfolio">Portfolio/Website</Label>
        <Input
          id="portfolio"
          value={portfolioUrl}
          onChange={(e) => onPortfolioUrlChange(e.target.value)}
          placeholder="https://seu-portfolio.com"
        />
      </div>
    </div>
  );
}