import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Skeleton } from "@/components/ui/skeleton"
import { Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import supabase from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
interface Comment {
  id: string
  content: string
  created_at: string
  deleted_at?: string | null
  author: {
    full_name: string
    id: string
    logo_url: string
  }
}

interface PostCommentsProps {
  comments: Comment[]
  newComment: string
  isLoading: boolean
  isSubmitting?: boolean
  onCommentChange: (value: string) => void
  onSubmitComment: () => void
}

export function PostComments({
  comments,
  newComment,
  isLoading,
  isSubmitting = false,
  onCommentChange,
  onSubmitComment
}: PostCommentsProps) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isDeletingComment, setIsDeletingComment] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          console.log("Checking admin status for user:", user.id)
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single()

          if (error) {
            console.error("Error checking admin status:", error)
            return
          }

          console.log("Admin status:", profile?.is_admin)
          setIsAdmin(profile?.is_admin || false)
        }
      } catch (error) {
        console.error("Error in checkAdminStatus:", error)
      }
    }

    checkAdminStatus()
  }, [])

  const handleDeleteComment = async (commentId: string) => {
    try {
      setIsDeletingComment(commentId)
      const { error } = await supabase
        .from('community_post_comments')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', commentId)

      if (error) {
        console.error("Error deleting comment:", error)
        throw error
      }

      toast({
        title: "Comentário removido",
        description: "O comentário foi removido com sucesso.",
      })

      // Atualizar a lista de comentários localmente
      const updatedComments = comments.map(comment =>
        comment.id === commentId
          ? { ...comment, deleted_at: new Date().toISOString() }
          : comment
      )

      // Se você tiver uma função para atualizar os comentários no componente pai
      // onCommentsUpdate(updatedComments)
    } catch (error) {
      console.error('Error deleting comment:', error)
      toast({
        title: "Erro ao remover comentário",
        description: "Ocorreu um erro ao tentar remover o comentário.",
        variant: "destructive"
      })
    } finally {
      setIsDeletingComment(null)
    }
  }

  const formatDate = (date: string) => {
    const commentDate = new Date(date)
    const now = new Date()
    const diffInHours = Math.abs(now.getTime() - commentDate.getTime()) / 36e5

    if (diffInHours < 24) {
      return format(commentDate, "'Hoje às' HH:mm", { locale: ptBR })
    } else if (diffInHours < 48) {
      return format(commentDate, "'Ontem às' HH:mm", { locale: ptBR })
    } else {
      return format(commentDate, "d 'de' MMMM 'às' HH:mm", { locale: ptBR })
    }
  }

  const activeComments = comments.filter(comment => !comment.deleted_at)

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        <Textarea
          placeholder="Escreva um comentário..."
          value={newComment}
          onChange={(e) => onCommentChange(e.target.value)}
          className="min-h-[60px] resize-none"
          disabled={isSubmitting}
        />
        <Button
          onClick={onSubmitComment}
          disabled={!newComment.trim() || isSubmitting}
          className="shrink-0"
        >
          {isSubmitting ? "Enviando..." : "Comentar"}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : (
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {activeComments.length === 0 ? (
            <p className="text-center text-gray-500">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
          ) : (
            <div className="space-y-4">
              {activeComments.map((comment) => (
                <div key={comment.id} className="group rounded-lg border p-4 transition-colors hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <Avatar className="w-10 h-10 mr-2 border border-gray-200">
                      <AvatarImage src={comment.author.logo_url} />
                      <AvatarFallback>
                        {comment.author.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex justify-between items-start flex-1">
                      <span className="font-medium text-gray-900 mt-2">{comment.author.full_name}</span>
                      <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
                    </div>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={isDeletingComment === comment.id}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  )
}