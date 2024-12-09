import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Rule {
  id: string
  content: string
  is_active: boolean
}

interface AdminRulesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AdminRulesDialog({ open, onOpenChange }: AdminRulesDialogProps) {
  const { toast } = useToast()
  const [rules, setRules] = useState<Rule[]>([])
  const [isAddingRule, setIsAddingRule] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      content: "",
    },
  })

  useEffect(() => {
    const loadUserAndRules = async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }

      // Load rules
      const { data } = await supabase
        .from("community_pinned_rules")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (data) setRules(data)
    }

    if (open) {
      loadUserAndRules()
    }
  }, [open])

  const onSubmit = async (values: any) => {
    if (!userId) {
      toast({
        title: "Erro ao criar regra",
        description: "Usuário não autenticado",
        variant: "destructive",
      })
      return
    }

    const { error } = await supabase
      .from("community_pinned_rules")
      .insert([{ 
        ...values, 
        is_active: true,
        created_by: userId 
      }])

    if (error) {
      toast({
        title: "Erro ao criar regra",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Regra criada com sucesso",
      })
      setIsAddingRule(false)
      form.reset()
      const { data } = await supabase
        .from("community_pinned_rules")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (data) setRules(data)
    }
  }

  const toggleRuleStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("community_pinned_rules")
      .update({ is_active: !currentStatus })
      .eq("id", id)

    if (error) {
      toast({
        title: "Erro ao atualizar regra",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Regra atualizada com sucesso",
      })
      const { data } = await supabase
        .from("community_pinned_rules")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (data) setRules(data)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Regras</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Button onClick={() => setIsAddingRule(true)}>Nova Regra</Button>

          {isAddingRule && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conteúdo</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button type="submit">Criar Regra</Button>
                  <Button type="button" variant="outline" onClick={() => setIsAddingRule(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Conteúdo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>{rule.content}</TableCell>
                  <TableCell>{rule.is_active ? "Ativa" : "Inativa"}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() => toggleRuleStatus(rule.id, rule.is_active)}
                    >
                      {rule.is_active ? "Desativar" : "Ativar"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  )
}