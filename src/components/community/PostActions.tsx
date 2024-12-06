import { Button } from "@/components/ui/button"
import { MessageSquare, ThumbsUp } from "lucide-react"

interface PostActionsProps {
  likes: number
  comments: number
  isLiked: boolean
  isLiking: boolean
  onLike: () => void
  onComment: () => void
}

export function PostActions({ likes, comments, isLiked, isLiking, onLike, onComment }: PostActionsProps) {
  return (
    <div className="flex gap-4 w-full">
      <Button 
        variant="ghost" 
        size="sm" 
        className={`text-gray-600 ${isLiked ? 'bg-gray-100' : ''}`}
        onClick={onLike}
        disabled={isLiking}
      >
        <ThumbsUp className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
        {likes}
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-gray-600"
        onClick={onComment}
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        {comments}
      </Button>
    </div>
  )
}