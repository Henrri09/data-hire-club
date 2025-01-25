import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { CreatePost } from "@/components/community/CreatePost"
import { PostCard } from "@/components/community/PostCard"
import { CommunityBanner } from "@/components/community/CommunityBanner"
import { CandidateHeader } from "@/components/candidate/Header"
import { CandidateSidebar } from "@/components/candidate/Sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { PinnedRule } from "@/components/community/PinnedRule"
import { AdminControls } from "@/components/community/introductions/AdminControls"
import { SearchBar } from "@/components/community/introductions/SearchBar"

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
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentRule, setCurrentRule] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchPosts()
    checkAdminStatus()
    fetchCurrentRule()
  }, [])

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      setIsAdmin(profile?.is_admin || false)
    }
  }

  const fetchCurrentRule = async () => {
    try {
      const { data, error } = await supabase
        .from('community_pinned_rules')
        .select('content')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .maybeSingle()

      if (error) throw error

      setCurrentRule(data?.content || "")
    } catch (error) {
      console.error('Error fetching current rule:', error)
    }
  }

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      let query = supabase
        .from('community_posts')
        .select(`
          id,
          content,
          created_at,
          likes_count,
          comments_count,
          author:profiles!community_posts_author_id_fkey(id, full_name)
        `)
        .eq('post_type', 'learning')
        .order('created_at', { ascending: false })

      if (searchQuery) {
        query = query.ilike('content', `%${searchQuery}%`)
      }

      const { data, error } = await query

      if (error) throw error

      const formattedPosts = (data || []).map(post => ({
        id: post.id,
        content: post.content,
        created_at: post.created_at,
        likes_count: post.likes_count,
        comments_count: post.comments_count,
        author: {
          id: post.author.id,
          full_name: post.author.full_name
        }
      }))

      setPosts(formattedPosts)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <CandidateHeader />
      <div className="flex flex-1">
        {!isMobile && <CandidateSidebar />}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">O que você está aprendendo?</h1>
            </div>

            {isAdmin && (
              <AdminControls
                currentRule={currentRule}
                onRuleUpdate={fetchCurrentRule}
                type="LEARNING"
              />
            )}

            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={fetchPosts}
            />

            <CommunityBanner type="LEARNING" />
            <PinnedRule content={currentRule} />
            <CreatePost onPostCreated={fetchPosts} />

            <div className="space-y-4">
              {isLoading ? (
                <p className="text-center text-gray-500">Carregando posts...</p>
              ) : posts.length === 0 ? (
                <p className="text-center text-gray-500">
                  {searchQuery 
                    ? "Nenhum post encontrado para sua busca."
                    : "Nenhum post encontrado. Compartilhe o que você está aprendendo!"}
                </p>
              ) : (
                posts.map((post) => (
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