import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface PostHeaderProps {
  author: {
    name: string
    avatar?: string
  }
  created_at: string
}

export function PostHeader({ author, created_at }: PostHeaderProps) {
  const formatDate = (date: string) => {
    return format(new Date(date), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })
  }

  return (
    <div className="flex flex-row items-center gap-4">
      <Avatar>
        <AvatarImage src={author.avatar} />
        <AvatarFallback>{author.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <h3 className="font-semibold">{author.name}</h3>
        <p className="text-sm text-gray-500">{formatDate(created_at)}</p>
      </div>
    </div>
  )
}