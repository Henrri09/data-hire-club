import { Pin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface PinnedRuleProps {
  content: string
}

export function PinnedRule({ content }: PinnedRuleProps) {
  if (!content) return null
  
  return (
    <Card className="mb-6 bg-muted/30">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Pin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Regra Fixada</span>
        </div>
        <p className="text-sm text-muted-foreground">{content}</p>
      </CardContent>
    </Card>
  )
}