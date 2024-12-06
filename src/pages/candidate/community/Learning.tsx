import { CreatePost } from "@/components/community/CreatePost"
import { PostCard } from "@/components/community/PostCard"
import { CandidateHeader } from "@/components/candidate/Header"
import { CandidateSidebar } from "@/components/candidate/Sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

interface Post {
  id: string
  content: string
  created_at: string
  likes_count: number
  comments_count: number
  author: {
    full_name: string
    id: string
  }
}

export default function Learning() {
  const isMobile = useIsMobile()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          id,
          content,
          created_at,
          likes_count,
          comments_count,
          author:profiles(id, full_name)
        `)
        .eq('post_type', 'learning')
        .order('created_at', { ascending: false })

      if (error) throw error

      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (date: string) => {
    const now = new Date()
    const postDate = new Date(date)
    const diffTime = Math.abs(now.getTime() - postDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Há 1 dia'
    if (diffDays < 1) {
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
      if (diffHours === 1) return 'Há 1 hora'
      if (diffHours < 1) {
        const diffMinutes = Math.ceil(diffTime / (1000 * 60))
        if (diffMinutes === 1) return 'Há 1 minuto'
        return `Há ${diffMinutes} minutos`
      }
      return `Há ${diffHours} horas`
    }
    return `Há ${diffDays} dias`
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <CandidateHeader />
      <div className="flex flex-1">
        {!isMobile && <CandidateSidebar />}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">O que você está aprendendo?</h1>
            <CreatePost />
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-center text-gray-500">Carregando posts...</p>
              ) : posts.length === 0 ? (
                <p className="text-center text-gray-500">Nenhum post encontrado. Compartilhe o que você está aprendendo!</p>
              ) : (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    author={{
                      name: post.author?.full_name || 'Usuário Anônimo',
                      date: formatDate(post.created_at),
                    }}
                    content={post.content}
                    likes={post.likes_count}
                    comments={post.comments_count}
                  />
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}