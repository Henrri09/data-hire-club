import { useState } from "react"
import { Pin, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"

interface PinnedRuleProps {
  content: string
  ruleId?: string
  isAdmin?: boolean
  onUpdate?: () => void
}

export function PinnedRule({ content, ruleId, isAdmin = false, onUpdate }: PinnedRuleProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editedContent, setEditedContent] = useState(content)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  if (!content) return null

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase
        .from('community_pinned_rules')
        .update({ is_active: false })
        .eq('id', ruleId)

      if (error) throw error

      toast({
        title: "Regra removida",
        description: "A regra foi removida com sucesso.",
      })

      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Error deleting rule:', error)
      toast({
        title: "Erro ao remover regra",
        description: "Ocorreu um erro ao tentar remover a regra.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase
        .from('community_pinned_rules')
        .update({ content: editedContent })
        .eq('id', ruleId)

      if (error) throw error

      toast({
        title: "Regra atualizada",
        description: "A regra foi atualizada com sucesso.",
      })

      setIsEditDialogOpen(false)
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Error updating rule:', error)
      toast({
        title: "Erro ao atualizar regra",
        description: "Ocorreu um erro ao tentar atualizar a regra.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <>
      <Card className="mb-6 bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Pin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Regra Fixada</span>
            </div>
            {isAdmin && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditDialogOpen(true)}
                  disabled={isLoading}
                >
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{content}</p>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar regra fixada</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEdit} disabled={isLoading}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}