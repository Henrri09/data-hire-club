import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface JobPostingFormProps {
  formData: {
    titulo: string;
    descricao: string;
    local: string;
    senioridade: string;
    tipoContratacao: string;
    faixaSalarialMin: string;
    faixaSalarialMax: string;
    linkExterno: string;
  };
  handleInputChange: (field: string, value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function JobPostingForm({ 
  formData, 
  handleInputChange, 
  handleSubmit, 
  onCancel,
  isSubmitting = false 
}: JobPostingFormProps) {
  const { toast } = useToast();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.titulo || !formData.descricao || !formData.linkExterno) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Validação do link externo
    if (!formData.linkExterno.startsWith('http://') && !formData.linkExterno.startsWith('https://')) {
      toast({
        title: "Link inválido",
        description: "O link externo deve começar com http:// ou https://",
        variant: "destructive",
      });
      return;
    }

    handleSubmit(e);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 w-full max-h-[80vh] overflow-y-auto px-1">
      <DialogHeader>
        <DialogTitle>Publicar Nova Vaga</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="titulo">Título da Vaga *</Label>
          <Input
            id="titulo"
            value={formData.titulo}
            onChange={(e) => handleInputChange("titulo", e.target.value)}
            placeholder="Ex: Analista de Dados Sênior"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição da Vaga *</Label>
          <Textarea
            id="descricao"
            value={formData.descricao}
            onChange={(e) => handleInputChange("descricao", e.target.value)}
            placeholder="Descreva as responsabilidades e requisitos da vaga"
            className="min-h-[120px]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="local">Local</Label>
          <Input
            id="local"
            value={formData.local}
            onChange={(e) => handleInputChange("local", e.target.value)}
            placeholder="Ex: São Paulo, SP (Remoto)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="senioridade">Senioridade</Label>
            <Select
              value={formData.senioridade}
              onValueChange={(value) => handleInputChange("senioridade", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a senioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="junior">Júnior</SelectItem>
                <SelectItem value="pleno">Pleno</SelectItem>
                <SelectItem value="senior">Sênior</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipoContratacao">Tipo de Contratação</Label>
            <Select
              value={formData.tipoContratacao}
              onValueChange={(value) => handleInputChange("tipoContratacao", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clt">CLT</SelectItem>
                <SelectItem value="pj">PJ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="faixaSalarialMin">Faixa Salarial Mínima</Label>
            <Input
              id="faixaSalarialMin"
              type="number"
              value={formData.faixaSalarialMin}
              onChange={(e) => handleInputChange("faixaSalarialMin", e.target.value)}
              placeholder="Ex: 5000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="faixaSalarialMax">Faixa Salarial Máxima</Label>
            <Input
              id="faixaSalarialMax"
              type="number"
              value={formData.faixaSalarialMax}
              onChange={(e) => handleInputChange("faixaSalarialMax", e.target.value)}
              placeholder="Ex: 7000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkExterno">Link para Candidatura *</Label>
          <Input
            id="linkExterno"
            value={formData.linkExterno}
            onChange={(e) => handleInputChange("linkExterno", e.target.value)}
            placeholder="Ex: https://empresa.com/vagas/analista"
            required
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-[#7779f5] hover:bg-[#7779f5]/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publicando..." : "Publicar Vaga"}
        </Button>
      </DialogFooter>
    </form>
  );
}