import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { PostHeader } from "./PostHeader"
import { PostActions } from "./PostActions"
import { PostComments } from "./PostComments"
import { usePostActions } from "@/hooks/usePostActions"
import { usePostComments } from "@/hooks/usePostComments"

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

export function PostCard({ 
  id, 
  author, 
  content, 
  likes, 
  comments, 
  created_at, 
  isLiked = false, 
  onLikeChange 
}: PostCardProps) {
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