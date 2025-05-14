
import { useEffect, useState } from "react"
import supabase from "@/integrations/supabase/client"
import { CreatePost } from "@/components/community/CreatePost"
import { PostSkeleton } from "@/components/community/PostSkeleton"
import { CommunityHeader } from "@/components/community/CommunityHeader"
import { CommunityBanner } from "@/components/community/CommunityBanner"
import { PinnedRule } from "@/components/community/PinnedRule"
import { CandidateHeader } from "@/components/candidate/Header"
import { CandidateSidebar } from "@/components/candidate/Sidebar"
import { AdminControls } from "@/components/community/introductions/AdminControls"
import { SearchBar } from "@/components/community/introductions/SearchBar"
import { PostsList } from "@/components/community/introductions/PostsList"

interface PostAuthor {
  id: string;
  full_name: string | null;
  logo_url?: string | null;
}

interface Post {
  id: string;
  content: string;
  created_at: string;
  author: PostAuthor;
  likes_count: number;
  comments_count: number;
  post_type: string;
  is_liked?: boolean;
}

export default function Introductions() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [pinnedRule, setPinnedRule] = useState<{ content: string } | null>(null)
  const [banner, setBanner] = useState<{
    title: string;
    description: string;
    image_url?: string;
  } | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    checkAdminStatus()
    fetchPosts()
    fetchPinnedRule()
    fetchBanner()
  }, [])

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      setIsAdmin(!!profile?.is_admin)
    } catch (error) {
      console.error('Error checking admin status:', error)
    }
  }

  const fetchPinnedRule = async () => {
    try {
      const { data } = await supabase
        .from('community_pinned_rules')
        .select('content')
        .eq('is_active', true)
        .eq('post_type', 'introductions')
        .single()

      setPinnedRule(data)
    } catch (error) {
      console.log('No pinned rule found')
    }
  }

  const fetchBanner = async () => {
    try {
      const { data } = await supabase
        .from('community_banners')
        .select('title, description, image_url')
        .eq('is_active', true)
        .eq('type', 'introductions')
        .single()

      setBanner(data)
    } catch (error) {
      console.log('No banner found')
    }
  }

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          id, 
          content, 
          created_at, 
          likes_count, 
          comments_count, 
          author:author_id(id, full_name, logo_url)
        `)
        .eq('post_type', 'introductions')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Transformar os dados e lidar com possíveis valores nulos
      const formattedPosts = data.map(post => ({
        id: post.id,
        content: post.content,
        created_at: post.created_at,
        likes_count: post.likes_count,
        comments_count: post.comments_count,
        post_type: 'introductions',
        author: {
          id: post.author ? (post.author as any).id || '' : '',
          full_name: post.author && (post.author as any).full_name ? (post.author as any).full_name : 'Usuário Anônimo',
          logo_url: post.author && (post.author as any).logo_url ? (post.author as any).logo_url : ''
        }
      }))

      setPosts(formattedPosts)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const filteredPosts = posts.filter(post => {
    const content = post.content.toLowerCase()
    const author = post.author.full_name?.toLowerCase() || ''
    const term = searchTerm.toLowerCase()
    
    return content.includes(term) || author.includes(term)
  })

  const handleNewPost = () => {
    fetchPosts()
  }

  const loadMorePosts = () => {
    // Implementação de carregamento de mais posts poderia ser adicionada aqui
    console.log("Carregando mais posts...")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CandidateHeader />
      <div className="flex">
        <CandidateSidebar />
        <div className="flex-1 p-6 pl-64">
          <div className="max-w-3xl mx-auto">
            <CommunityHeader title="Apresente-se à Comunidade" isAdmin={isAdmin} />
            
            {banner && (
              <div className="mb-6">
                <CommunityBanner 
                  title={banner.title} 
                  description={banner.description}
                  imageUrl={banner.image_url}
                />
              </div>
            )}

            {pinnedRule && (
              <div className="mb-6">
                <PinnedRule content={pinnedRule.content} />
              </div>
            )}

            {isAdmin && <AdminControls type="introductions" />}

            <div className="mb-6">
              <CreatePost 
                type="introductions" 
                placeholder="Conte um pouco sobre você, sua experiência e objetivos..." 
                onPostSuccess={handleNewPost}
              />
            </div>

            <div className="mb-6">
              <SearchBar onSearch={handleSearch} />
            </div>

            {loading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <PostSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <PostsList
                  posts={filteredPosts}
                  isLoading={loading}
                  isLoadingMore={isLoadingMore}
                  hasMore={hasMore}
                  searchQuery={searchTerm}
                  onLoadMore={loadMorePosts}
                  onLikeChange={fetchPosts}
                  onPostDelete={fetchPosts}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
