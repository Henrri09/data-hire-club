import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export function CreatePost() {
  const [content, setContent] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Aqui será integrado com o backend posteriormente
    toast({
      title: "Post criado com sucesso!",
      description: "Seu post foi publicado na comunidade.",
    })
    
    setContent("")
  }

  return (
    <Card className="mb-6">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6">
          <Textarea
            placeholder="Compartilhe algo com a comunidade..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={!content.trim()}>
            Publicar
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}