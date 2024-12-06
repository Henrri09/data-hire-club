import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Skeleton } from "@/components/ui/skeleton"

interface Comment {
  id: string
  content: string
  created_at: string
  author: {
    full_name: string
    id: string
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
          {comments.length === 0 ? (
            <p className="text-center text-gray-500">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="group rounded-lg border p-4 transition-colors hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-900">{comment.author.full_name}</span>
                    <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
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