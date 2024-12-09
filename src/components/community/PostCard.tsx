import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { PostHeader } from "./PostHeader"
import { PostActions } from "./PostActions"
import { PostComments } from "./PostComments"
import { usePostActions } from "@/hooks/usePostActions"
import { usePostComments } from "@/hooks/usePostComments"
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { PostCardActions } from "./post/PostCardActions"
import { PostEditDialog } from "./post/PostEditDialog"
import { PostContent } from "./post/PostContent"
import { PostDeleteButton } from "./post/PostDeleteButton"

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
  onPostDelete?: () => void
}

export function PostCard({ 
  id, 
  author, 
  content, 
  likes, 
  comments, 
  created_at, 
  isLiked = false, 
  onLikeChange,
  onPostDelete
}: PostCardProps) {
  const [isCurrentUser, setIsCurrentUser] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)
  const { toast } = useToast()

  const { 
    isLiking, 
    localLiked, 
    localLikes, 
    handleLike 
  } = usePostActions({ 
    id, 
    initialLikes: likes, 
    initialIsLiked: isLiked, 
    onLikeChange 
  })

  const {
    showComments,
    newComment,
    postComments,
    isLoadingComments,
    setNewComment,
    loadComments,
    handleComment
  } = usePostComments(id)

  useEffect(() => {
    const checkUserPermissions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          console.log("Verificando permissões para usuário:", user.id)
          setIsCurrentUser(user.id === author.id)
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single()
          
          console.log("Perfil do usuário:", profile)
          setIsAdmin(profile?.is_admin || false)
        }
      } catch (error) {
        console.error("Erro ao verificar permissões:", error)
      }
    }

    checkUserPermissions()
  }, [author.id])

  const handleEdit = async () => {
    try {
      const { error } = await supabase
        .from('community_posts')
        .update({ content: editedContent })
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Post atualizado",
        description: "Seu post foi atualizado com sucesso.",
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Erro ao atualizar post:', error)
      toast({
        title: "Erro ao atualizar post",
        description: "Ocorreu um erro ao tentar atualizar o post.",
        variant: "destructive"
      })
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <PostHeader author={author} created_at={created_at} />
          <div className="flex gap-2">
            {isCurrentUser && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {(isCurrentUser || isAdmin) && (
              <PostDeleteButton
                postId={id}
                authorId={author.id}
                isAdmin={isAdmin}
                onPostDelete={onPostDelete}
              />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <PostContent content={content} />
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

      <PostEditDialog
        open={isEditing}
        content={editedContent}
        onOpenChange={setIsEditing}
        onContentChange={setEditedContent}
        onSave={handleEdit}
      />
    </Card>
  )
}