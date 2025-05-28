
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import supabase from "@/integrations/supabase/client"
import { useLocation, useNavigate } from "react-router-dom"

interface CreatePostProps {
  onPostCreated?: () => void
  onPostSuccess?: () => Promise<void>
  placeholder?: string
}

export function CreatePost({ onPostCreated, onPostSuccess, placeholder }: CreatePostProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const location = useLocation()
  const navigate = useNavigate()

  const getPostType = () => {
    if (location.pathname.includes('introductions')) return 'introduction'
    if (location.pathname.includes('learning')) return 'learning'
    if (location.pathname.includes('questions')) return 'question'
    return 'introduction'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) return

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast({
        title: "Erro ao criar post",
        description: "Você precisa estar logado para publicar.",
        variant: "destructive"
      })
      navigate("/login")
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('community_posts')
        .insert({
          content: content.trim(),
          post_type: getPostType(),
          author_id: user.id
        })

      if (error) throw error

      toast({
        title: "Post criado com sucesso!",
        description: "Seu post foi publicado na comunidade.",
      })

      setContent("")
      
      // Call both callback functions if provided
      if (onPostCreated) {
        onPostCreated()
      }
      if (onPostSuccess) {
        await onPostSuccess()
      }
    } catch (error) {
      console.error('Error creating post:', error)
      toast({
        title: "Erro ao criar post",
        description: "Ocorreu um erro ao tentar publicar seu post. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="mb-6">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6">
          <Textarea
            placeholder={placeholder || "Compartilhe algo com a comunidade..."}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none"
            disabled={isSubmitting}
          />
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {content.length}/500 caracteres
          </p>
          <Button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="bg-[#7779f5] hover:bg-[#7779f5]/90"
          >
            {isSubmitting ? "Publicando..." : "Publicar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
