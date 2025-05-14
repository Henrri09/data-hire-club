
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import supabase from "@/integrations/supabase/client"

interface Author {
  id: string;
  full_name: string | null;
  logo_url?: string | null;
}

interface Comment {
  id: string;
  post_id: string;
  content: string;
  created_at: string;
  author: Author;
}

export const usePostComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingAdd, setLoadingAdd] = useState(false)
  const { toast } = useToast()

  const fetchComments = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('community_post_comments')
        .select(`
          id,
          post_id,
          content,
          created_at,
          author:author_id(id, full_name, logo_url)
        `)
        .eq('post_id', postId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true })

      if (error) throw error

      // Transformar os dados e lidar com possíveis valores nulos
      const formattedComments = data.map(comment => ({
        id: comment.id,
        post_id: comment.post_id,
        content: comment.content,
        created_at: comment.created_at,
        author: {
          id: comment.author ? comment.author.id : '',
          full_name: comment.author && comment.author.full_name ? comment.author.full_name : 'Usuário Anônimo',
          logo_url: comment.author && comment.author.logo_url ? comment.author.logo_url : ''
        }
      }))

      setComments(formattedComments)
    } catch (err: any) {
      console.error('Error fetching comments:', err)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao carregar os comentários",
      })
    } finally {
      setLoading(false)
    }
  }

  const addComment = async (content: string) => {
    if (!content.trim()) return

    setLoadingAdd(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Você precisa estar logado para comentar",
        })
        return
      }

      const { data, error } = await supabase
        .from('community_post_comments')
        .insert({
          post_id: postId,
          author_id: user.id,
          content: content.trim(),
        })
        .select(`
          id,
          post_id,
          content,
          created_at,
          author:author_id(id, full_name, logo_url)
        `)
        .single()

      if (error) throw error

      const newComment = {
        id: data.id,
        post_id: data.post_id,
        content: data.content,
        created_at: data.created_at,
        author: {
          id: data.author ? data.author.id : '',
          full_name: data.author && data.author.full_name ? data.author.full_name : 'Usuário Anônimo',
          logo_url: data.author && data.author.logo_url ? data.author.logo_url : ''
        }
      }

      setComments(prev => [...prev, newComment])
      toast({
        title: "Comentário adicionado",
        description: "Seu comentário foi adicionado com sucesso",
      })
      return data.id
    } catch (err: any) {
      console.error('Error adding comment:', err)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao adicionar comentário",
      })
      return null
    } finally {
      setLoadingAdd(false)
    }
  }

  const handleComment = (content: string) => {
    return addComment(content)
  }

  return {
    comments,
    loading,
    loadingAdd,
    fetchComments,
    handleComment
  }
}
