import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import supabase from "@/integrations/supabase/client"

interface Comment {
  id: string
  content: string
  created_at: string
  author: {
    full_name: string
    id: string
    logo_url: string
  }
}

export function usePostComments(postId: string) {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [postComments, setPostComments] = useState<Comment[]>([])
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const { toast } = useToast()

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
            author:profiles!community_post_comments_author_id_fkey(id, full_name, logo_url)
          `)
          .eq('post_id', postId)
          .order('created_at', { ascending: false })

        if (error) throw error

        // Transform the data to match our Comment interface
        const formattedComments: Comment[] = (data || []).map(comment => ({
          id: comment.id,
          content: comment.content,
          created_at: comment.created_at,
          author: {
            id: comment.author.id,
            full_name: comment.author.full_name,
            logo_url: comment.author.logo_url
          }
        }))

        setPostComments(formattedComments)
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
          post_id: postId,
          author_id: user.id,
          content: newComment.trim()
        })
        .select(`
          id,
          content,
          created_at,
          author:profiles!community_post_comments_author_id_fkey(id, full_name, logo_url)
        `)
        .single()

      if (error) throw error

      if (data) {
        const newCommentData: Comment = {
          id: data.id,
          content: data.content,
          created_at: data.created_at,
          author: {
            id: data.author.id,
            full_name: data.author.full_name,
            logo_url: data.author.logo_url
          }
        }

        setPostComments(prev => [newCommentData, ...prev])
        setNewComment("")

        toast({
          title: "Comentário adicionado",
          description: "Seu comentário foi publicado com sucesso.",
        })
      }
    } catch (error) {
      console.error('Error posting comment:', error)
      toast({
        title: "Erro ao comentar",
        description: "Ocorreu um erro ao tentar publicar seu comentário.",
        variant: "destructive"
      })
    }
  }

  return {
    showComments,
    newComment,
    postComments,
    isLoadingComments,
    setNewComment,
    loadComments,
    handleComment
  }
}