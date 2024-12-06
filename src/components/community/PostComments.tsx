import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

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
  onCommentChange: (value: string) => void
  onSubmitComment: () => void
}

export function PostComments({ comments, newComment, isLoading, onCommentChange, onSubmitComment }: PostCommentsProps) {
  const formatDate = (date: string) => {
    return format(new Date(date), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        <Textarea
          placeholder="Escreva um comentário..."
          value={newComment}
          onChange={(e) => onCommentChange(e.target.value)}
          className="min-h-[60px]"
        />
        <Button 
          onClick={onSubmitComment}
          disabled={!newComment.trim()}
        >
          Comentar
        </Button>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500">Carregando comentários...</p>
      ) : (
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {comments.length === 0 ? (
            <p className="text-center text-gray-500">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{comment.author.full_name}</span>
                    <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  )
}