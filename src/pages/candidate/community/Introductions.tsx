import { CreatePost } from "@/components/community/CreatePost"
import { PostCard } from "@/components/community/PostCard"
import { PostSkeleton } from "@/components/community/PostSkeleton"
import { CommunityBanner } from "@/components/community/CommunityBanner"
import { CandidateHeader } from "@/components/candidate/Header"
import { CandidateSidebar } from "@/components/candidate/Sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

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
  is_liked?: boolean
}

export default function Introductions() {
  const isMobile = useIsMobile()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const postsPerPage = 10

  const fetchPosts = async (isNewSearch = false) => {
    try {
      if (isNewSearch) {
        setIsLoading(true)
        setPage(1)
        setPosts([])
      } else {
        setIsLoadingMore(true)
      }

      const { data: { user } } = await supabase.auth.getUser()

      let query = supabase
        .from('community_posts')
        .select(`
          id,
          content,
          created_at,
          likes_count,
          comments_count,
          author:profiles(id, full_name)
        `)
        .eq('post_type', 'introduction')
        .order('created_at', { ascending: false })
        .range((page - 1) * postsPerPage, page * postsPerPage - 1)

      if (searchQuery) {
        query = query.ilike('content', `%${searchQuery}%`)
      }

      const { data: posts, error } = await query

      if (error) throw error

      // Fetch likes for current user if logged in
      let postsWithLikes = posts || []
      if (user) {
        const { data: likes } = await supabase
          .from('community_post_likes')
          .select('post_id')
          .eq('user_id', user.id)
          .in('post_id', postsWithLikes.map(post => post.id))

        const likedPostIds = new Set(likes?.map(like => like.post_id))
        postsWithLikes = postsWithLikes.map(post => ({
          ...post,
          is_liked: likedPostIds.has(post.id)
        }))
      }

      if (isNewSearch) {
        setPosts(postsWithLikes)
      } else {
        setPosts(prev => [...prev, ...postsWithLikes])
      }
      
      setHasMore(postsWithLikes.length === postsPerPage)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [page])

  const handleSearch = () => {
    fetchPosts(true)
  }

  const handleLoadMore = () => {
    setPage(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <CandidateHeader />
      <div className="flex flex-1">
        {!isMobile && <CandidateSidebar />}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-3xl mx-auto">
            <CommunityBanner />
            <h1 className="text-2xl font-bold mb-6">Apresente-se à Comunidade</h1>
            
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>

            <CreatePost onPostCreated={() => fetchPosts(true)} />
            
            <div className="space-y-4">
              {isLoading ? (
                <>
                  <PostSkeleton />
                  <PostSkeleton />
                  <PostSkeleton />
                </>
              ) : posts.length === 0 ? (
                <p className="text-center text-gray-500">
                  {searchQuery 
                    ? "Nenhum post encontrado para sua busca."
                    : "Nenhum post encontrado. Seja o primeiro a se apresentar!"}
                </p>
              ) : (
                <>
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      id={post.id}
                      author={{
                        name: post.author?.full_name || 'Usuário Anônimo',
                        id: post.author?.id
                      }}
                      content={post.content}
                      likes={post.likes_count}
                      comments={post.comments_count}
                      created_at={post.created_at}
                      isLiked={post.is_liked}
                      onLikeChange={() => fetchPosts()}
                    />
                  ))}
                  
                  {hasMore && (
                    <div className="text-center pt-4">
                      <Button
                        variant="outline"
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                      >
                        {isLoadingMore ? "Carregando..." : "Carregar mais"}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}