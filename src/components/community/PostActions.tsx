import { Button } from "@/components/ui/button"
import { MessageSquare, ThumbsUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface PostActionsProps {
  likes: number
  comments: number
  isLiked: boolean
  isLiking: boolean
  onLike: () => void
  onComment: () => void
}

export function PostActions({ 
  likes, 
  comments, 
  isLiked, 
  isLiking, 
  onLike, 
  onComment 
}: PostActionsProps) {
  if (isLiking) {
    return (
      <div className="flex gap-4 w-full">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    )
  }

  return (
    <div className="flex gap-4 w-full">
      <Button 
        variant="ghost" 
        size="sm" 
        className={`text-gray-600 transition-colors ${isLiked ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'hover:bg-gray-100'}`}
        onClick={onLike}
        disabled={isLiking}
      >
        <ThumbsUp className={`mr-2 h-4 w-4 transition-colors ${isLiked ? 'fill-primary text-primary' : ''}`} />
        {likes}
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-gray-600 hover:bg-gray-100 transition-colors"
        onClick={onComment}
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        {comments}
      </Button>
    </div>
  )
}