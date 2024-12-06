import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { PostHeader } from "./PostHeader"
import { PostActions } from "./PostActions"
import { PostComments } from "./PostComments"

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
        const { error } = await supabase
          .from('community_post_likes')
          .delete()
          .eq('post_id', id)
          .eq('user_id', user.id)

        if (error) throw error
        setLocalLikes(prev => prev - 1)
      } else {
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

  return (
    <Card className="mb-4">
      <CardHeader>
        <PostHeader author={author} created_at={created_at} />
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <PostActions
          likes={localLikes}
          comments={comments}
          isLiked={localLiked}
          isLiking={isLiking}
          onLike={handleLike}
          onComment={loadComments}
        />

        {showComments && (
          <PostComments
            comments={postComments}
            newComment={newComment}
            isLoading={isLoadingComments}
            onCommentChange={setNewComment}
            onSubmitComment={handleComment}
          />
        )}
      </CardFooter>
    </Card>
  )
}