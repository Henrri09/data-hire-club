
import { useState } from "react"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { Post } from "@/types/community.types"

interface UsePostActionsProps {
  postId: string;
  initialLiked: boolean;
  initialLikes: number;
  onLikeChange?: () => void;
}

export function usePostActions({ postId, initialLiked, initialLikes, onLikeChange }: UsePostActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [likesCount, setLikesCount] = useState(initialLikes)

  const toggleLike = async () => {
    try {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error("Você precisa estar logado para curtir posts.")
        return
      }

      if (isLiked) {
        const { error } = await supabase
          .from('community_post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id)

        if (error) throw error
        setLikesCount(prev => prev - 1)
      } else {
        const { error } = await supabase
          .from('community_post_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          })

        if (error) throw error
        setLikesCount(prev => prev + 1)
      }

      setIsLiked(!isLiked)
      if (onLikeChange) onLikeChange()

    } catch (error) {
      console.error('Error toggling like:', error)
      toast.error("Ocorreu um erro ao tentar curtir o post.")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLiked,
    likesCount,
    toggleLike,
    isLoading
  }
}
