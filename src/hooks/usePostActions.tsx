import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import supabase from "@/integrations/supabase/client"

interface UsePostActionsProps {
  id: string
  initialLikes: number
  initialIsLiked: boolean
  onLikeChange?: () => void
}

export function usePostActions({
  id,
  initialLikes,
  initialIsLiked,
  onLikeChange
}: UsePostActionsProps) {
  const [isLiking, setIsLiking] = useState(false)
  const [localLiked, setLocalLiked] = useState(initialIsLiked)
  const [localLikes, setLocalLikes] = useState(initialLikes)
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

  return {
    isLiking,
    localLiked,
    localLikes,
    handleLike
  }
}