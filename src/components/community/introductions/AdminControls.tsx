import { useState } from "react"
import { Pin, Upload, AlertCircleIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BannerType, UploadImage } from "@/components/common/UploadImage"

interface AdminControlsProps {
  currentRule?: string
  onRuleUpdate?: () => void,
  type: BannerType
}

export function AdminControls({ currentRule, onRuleUpdate, type }: AdminControlsProps) {
  const [rule, setRule] = useState(currentRule || "")
  const [isUpdatingRule, setIsUpdatingRule] = useState(false)

  const { toast } = useToast()

  const handleRuleUpdate = async () => {
    if (!rule.trim()) return

    try {
      setIsUpdatingRule(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      // Desativar regras anteriores
      await supabase
        .from('community_pinned_rules')
        .update({ is_active: false })
        .eq('is_active', true)

      // Criar nova regra
      const { error } = await supabase
        .from('community_pinned_rules')
        .insert([{
          content: rule,
          created_by: user.id,
          is_active: true
        }])

      if (error) throw error

      toast({
        title: "Regra atualizada",
        description: "A regra foi atualizada com sucesso!"
      })

      setRule("") // Limpa o campo após atualização bem-sucedida
      onRuleUpdate?.()

    } catch (error) {
      console.error('Error updating rule:', error)
      toast({
        title: "Erro ao atualizar regra",
        description: "Ocorreu um erro ao atualizar a regra.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingRule(false)
    }
  }

  return (
    <div className="space-y-6 mb-8 bg-muted/30 p-6 rounded-lg border">
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-primary/10 hover:bg-primary/20">
          Administrador
        </Badge>
        <Pin className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Regra Fixada
          </label>
          <div className="flex gap-2">
            <Textarea
              placeholder="Digite a regra que será fixada..."
              value={rule}
              onChange={(e) => setRule(e.target.value)}
              className="min-h-[100px] bg-background"
            />
            <Button
              onClick={handleRuleUpdate}
              disabled={!rule.trim() || isUpdatingRule}
            >
              Atualizar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}