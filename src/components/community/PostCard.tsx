import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { MessageSquare, ThumbsUp } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
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

interface PostCardProps {
  id: string
  author: {
    name: string
    avatar?: string
    id: string
  }
  content: string
  likes: number
  comments: number
  created_at: string
  isLiked?: boolean
  onLikeChange?: () => void
}

export function PostCard({ id, author, content, likes, comments, created_at, isLiked = false, onLikeChange }: PostCardProps) {
  const [isLiking, setIsLiking] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [postComments, setPostComments] = useState<Comment[]>([])
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [localLiked, setLocalLiked] = useState(isLiked)
  const [localLikes, setLocalLikes] = useState(likes)
  const { toast } = useToast()

  const handleLike = async () => {
    try {
      setIsLiking(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast({
          title: "Erro ao curtir post",
          description: "Você precisa estar logado para curtir posts.",
          variant: "destructive"
        })
        return
      }

      if (localLiked) {
        // Remove like
        const { error } = await supabase
          .from('community_post_likes')
          .delete()
          .eq('post_id', id)
          .eq('user_id', user.id)

        if (error) throw error
        setLocalLikes(prev => prev - 1)
      } else {
        // Add like
        const { error } = await supabase
          .from('community_post_likes')
          .insert({
            post_id: id,
            user_id: user.id
          })

        if (error) throw error
        setLocalLikes(prev => prev + 1)
      }

      setLocalLiked(!localLiked)
      if (onLikeChange) onLikeChange()

    } catch (error) {
      console.error('Error toggling like:', error)
      toast({
        title: "Erro ao curtir post",
        description: "Ocorreu um erro ao tentar curtir o post.",
        variant: "destructive"
      })
    } finally {
      setIsLiking(false)
    }
  }

  const loadComments = async () => {
    if (!showComments) {
      try {
        setIsLoadingComments(true)
        const { data, error } = await supabase
          .from('community_post_comments')
          .select(`
            id,
            content,
            created_at,
            author:profiles(id, full_name)
          `)
          .eq('post_id', id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setPostComments(data || [])
        setShowComments(true)
      } catch (error) {
        console.error('Error loading comments:', error)
        toast({
          title: "Erro ao carregar comentários",
          description: "Ocorreu um erro ao carregar os comentários.",
          variant: "destructive"
        })
      } finally {
        setIsLoadingComments(false)
      }
    } else {
      setShowComments(false)
    }
  }

  const handleComment = async () => {
    if (!newComment.trim()) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast({
          title: "Erro ao comentar",
          description: "Você precisa estar logado para comentar.",
          variant: "destructive"
        })
        return
      }

      const { error, data } = await supabase
        .from('community_post_comments')
        .insert({
          post_id: id,
          author_id: user.id,
          content: newComment.trim()
        })
        .select(`
          id,
          content,
          created_at,
          author:profiles(id, full_name)
        `)
        .single()

      if (error) throw error

      setPostComments(prev => [data, ...prev])
      setNewComment("")
      
      toast({
        title: "Comentário adicionado",
        description: "Seu comentário foi publicado com sucesso.",
      })
    } catch (error) {
      console.error('Error posting comment:', error)
      toast({
        title: "Erro ao comentar",
        description: "Ocorreu um erro ao tentar publicar seu comentário.",
        variant: "destructive"
      })
    }
  }

  const formatDate = (date: string) => {
    return format(new Date(date), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })
  }

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={author.avatar} />
          <AvatarFallback>{author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3 className="font-semibold">{author.name}</h3>
          <p className="text-sm text-gray-500">{formatDate(created_at)}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex gap-4 w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-gray-600 ${localLiked ? 'bg-gray-100' : ''}`}
            onClick={handleLike}
            disabled={isLiking}
          >
            <ThumbsUp className={`mr-2 h-4 w-4 ${localLiked ? 'fill-current' : ''}`} />
            {localLikes}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-600"
            onClick={loadComments}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            {comments}
          </Button>
        </div>

        {showComments && (
          <div className="w-full space-y-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="Escreva um comentário..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[60px]"
              />
              <Button 
                onClick={handleComment}
                disabled={!newComment.trim()}
              >
                Comentar
              </Button>
            </div>

            {isLoadingComments ? (
              <p className="text-center text-gray-500">Carregando comentários...</p>
            ) : (
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                {postComments.length === 0 ? (
                  <p className="text-center text-gray-500">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
                ) : (
                  <div className="space-y-4">
                    {postComments.map((comment) => (
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
        )}
      </CardFooter>
    </Card>
  )
}