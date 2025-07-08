
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Pin, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface PinnedRuleProps {
  content?: string;
}

export function PinnedRule({ content: initialContent }: PinnedRuleProps) {
  const [rule, setRule] = useState(initialContent || "")
  const [isAdmin, setIsAdmin] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single()

        setIsAdmin(profile?.is_admin || false)
      }
    }

    const fetchRule = async () => {
      if (!initialContent) {
        const { data, error } = await supabase
          .from('community_pinned_rules')
          .select('content')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)

        if (data && data.length > 0) {
          setRule(data[0].content)
        } else {
          setRule("Seja respeitoso e mantenha as discussões relevantes para a área de dados.")
        }

        if (error) {
          console.error('Error fetching rule:', error)
        }
      }
    }

    checkAdminStatus()
    fetchRule()
  }, [initialContent])

  if (!rule) return null

  return (
    <Card className="mb-6 bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Pin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">Regras da Comunidade</h3>
            <p className="text-blue-800 text-sm">{rule}</p>
          </div>
          {isAdmin && (
            <Button variant="ghost" size="icon" className="text-blue-600">
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
