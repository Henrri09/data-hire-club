
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import supabase from "@/integrations/supabase/client"
import { Post } from "@/types/community.types"

export function usePostActions(post: Post) {
  const [isLiking, setIsLiking] = useState(false)
  const [localLiked, setLocalLiked] = useState(false)
  const [localLikes, setLocalLikes] = useState(post.likes_count)
  const { toast } = useToast()

  const toggleLike = async () => {
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
          .eq('post_id', post.id)
          .eq('user_id', user.id)

        if (error) throw error
        setLocalLikes(prev => prev - 1)
      } else {
        const { error } = await supabase
          .from('community_post_likes')
          .insert({
            post_id: post.id,
            user_id: user.id
          })

        if (error) throw error
        setLocalLikes(prev => prev + 1)
      }

      setLocalLiked(!localLiked)

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

  return {
    isLiked: localLiked,
    likesCount: localLikes,
    toggleLike,
    isLoading: isLiking
  }
}
