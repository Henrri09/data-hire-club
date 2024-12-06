import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { MessageSquare, ThumbsUp } from "lucide-react"

interface PostCardProps {
  author: {
    name: string
    avatar?: string
    date: string
  }
  content: string
  likes: number
  comments: number
}

export function PostCard({ author, content, likes, comments }: PostCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={author.avatar} />
          <AvatarFallback>{author.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{author.name}</h3>
          <p className="text-sm text-gray-500">{author.date}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{content}</p>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button variant="ghost" size="sm" className="text-gray-600">
          <ThumbsUp className="mr-2 h-4 w-4" />
          {likes}
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-600">
          <MessageSquare className="mr-2 h-4 w-4" />
          {comments}
        </Button>
      </CardFooter>
    </Card>
  )
}