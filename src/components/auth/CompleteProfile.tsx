import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import supabase from "@/integrations/supabase/client";
import { SkillsInput } from "../candidate/profile/SkillsInput";

export function CompleteProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("Usuário não encontrado");

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          headline,
          bio,
          skills,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado",
        description: "Seu perfil foi atualizado com sucesso!",
      });

      // Redirecionar baseado no tipo de usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single();

      if (profile?.user_type === 'candidate') {
        navigate('/candidate/dashboard');
      } else if (profile?.user_type === 'company') {
        navigate('/company/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Complete seu perfil</h2>
          <p className="text-gray-600 mt-2">
            Ajude-nos a conhecer você melhor para personalizar sua experiência
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome completo</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Seu nome completo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="headline">Título profissional</Label>
            <Input
              id="headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              required
              placeholder="Ex: Analista de Dados Senior"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biografia</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
              placeholder="Conte-nos um pouco sobre você..."
              className="h-32"
            />
          </div>

          <SkillsInput
            skills={skills}
            onSkillsChange={setSkills}
          />

          <Button
            type="submit"
            className="w-full bg-[#7779f5] hover:bg-[#7779f5]/90"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Completar perfil"}
          </Button>
        </form>
      </div>
    </div>
  );
}