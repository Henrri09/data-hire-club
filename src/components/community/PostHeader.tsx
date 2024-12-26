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
    const postDate = new Date(date)
    const now = new Date()
    const diffInHours = Math.abs(now.getTime() - postDate.getTime()) / 36e5

    if (diffInHours < 24) {
      return format(postDate, "'Hoje às' HH:mm", { locale: ptBR })
    } else if (diffInHours < 48) {
      return format(postDate, "'Ontem às' HH:mm", { locale: ptBR })
    } else {
      return format(postDate, "d 'de' MMMM 'às' HH:mm", { locale: ptBR })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div className="flex flex-row items-center gap-4">
      <Avatar className="h-10 w-10 border">
        <AvatarImage 
          src={author.avatar} 
          className="object-cover"
          alt={`Foto de perfil de ${author.name}`}
        />
        <AvatarFallback className="bg-primary/10">
          {getInitials(author.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <h3 className="font-semibold text-gray-900">{author.name}</h3>
        <p className="text-sm text-gray-500">{formatDate(created_at)}</p>
      </div>
    </div>
  )
}