import { useState } from "react"
import { Pin, Upload, AlertCircleIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AdminControlsProps {
  currentRule?: string
  onRuleUpdate?: () => void
}

export function AdminControls({ currentRule, onRuleUpdate }: AdminControlsProps) {
  const [rule, setRule] = useState(currentRule || "")
  const [isUploadingBanner, setIsUploadingBanner] = useState(false)
  const [isUpdatingRule, setIsUpdatingRule] = useState(false)
  const [selectedBannerType, setSelectedBannerType] = useState<"INTRODUCTION" | "LEARNING" | "QUESTIONS" | null>(null)
  const [errorBannerType, setErrorBannerType] = useState<string | null>(null)
  const { toast } = useToast()

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedBannerType) {
      return setErrorBannerType("Selecione o tipo de banner para poder fazer upload")
    } else {
      setErrorBannerType(null)
    }
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploadingBanner(true)

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      // Upload to Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${crypto.randomUUID()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase
        .storage
        .from('banners')
        .getPublicUrl(fileName)

      // Desativar banners anteriores
      await supabase
        .from('community_banners')
        .update({ is_active: false })
        .eq('is_active', true)
        .eq('type', selectedBannerType)

      // Criar novo banner
      const { error: insertError } = await supabase
        .from('community_banners')
        .insert([{
          image_url: publicUrl,
          is_active: true,
          created_by: user.id,
          type: selectedBannerType
        }])

      if (insertError) throw insertError

      toast({
        title: "Banner atualizado",
        description: "O banner foi atualizado com sucesso!"
      })

    } catch (error) {
      console.error('Error uploading banner:', error)
      toast({
        title: "Erro ao fazer upload",
        description: "Ocorreu um erro ao fazer upload do banner.",
        variant: "destructive",
      })
    } finally {
      setIsUploadingBanner(false)
    }
  }

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

      onRuleUpdate?.()
      setRule("") // Limpa o campo após atualização bem-sucedida

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

        <div>
          <label className="text-sm font-medium mb-2 block">
            Banner da Comunidade
          </label>

          <div className="flex flex-col gap-2 mb-2">
            <Select
              onValueChange={(value) => setSelectedBannerType(value as "INTRODUCTION" | "LEARNING" | "QUESTIONS" | null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de banner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INTRODUCTION">Introdução</SelectItem>
                <SelectItem value="LEARNING">Aprendizado</SelectItem>
                <SelectItem value="QUESTIONS">Perguntas</SelectItem>
              </SelectContent>
            </Select>
            {errorBannerType && <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircleIcon size={16} color="rgb(239 68 68)" />
              <p className="text-red-500">
                Selecione o tipo de banner para poder fazer upload
              </p>
            </div>}
          </div>

          <div className="relative">
            <Button
              variant="outline"
              className="w-full h-24 relative bg-background"
              disabled={isUploadingBanner}
            >
              <Upload className="h-6 w-6 text-muted-foreground absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              <input
                type="file"
                onChange={handleBannerUpload}
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                disabled={isUploadingBanner}
              />
            </Button>
            {isUploadingBanner && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Fazendo upload...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}