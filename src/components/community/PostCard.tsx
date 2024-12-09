import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { PostHeader } from "./PostHeader"
import { PostActions } from "./PostActions"
import { PostComments } from "./PostComments"
import { usePostActions } from "@/hooks/usePostActions"
import { usePostComments } from "@/hooks/usePostComments"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

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
  const [isDeleting, setIsDeleting] = useState(false)
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
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setIsCurrentUser(user.id === author.id)
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single()
        
        setIsAdmin(profile?.is_admin || false)
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
      console.error('Error updating post:', error)
      toast({
        title: "Erro ao atualizar post",
        description: "Ocorreu um erro ao tentar atualizar o post.",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Post removido",
        description: "O post foi removido com sucesso.",
      })
      
      if (onPostDelete) {
        onPostDelete()
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      toast({
        title: "Erro ao remover post",
        description: "Ocorreu um erro ao tentar remover o post.",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <PostHeader author={author} created_at={created_at} />
          {(isCurrentUser || isAdmin) && (
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
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          )}
        </div>
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

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar post</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEdit}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}