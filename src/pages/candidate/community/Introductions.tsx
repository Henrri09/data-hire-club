import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { CreatePost } from "@/components/community/CreatePost"
import { CommunityBanner } from "@/components/community/CommunityBanner"
import { CandidateHeader } from "@/components/candidate/Header"
import { CandidateSidebar } from "@/components/candidate/Sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { IntroductionsHeader } from "@/components/community/introductions/IntroductionsHeader"
import { SearchBar } from "@/components/community/introductions/SearchBar"
import { PostsList } from "@/components/community/introductions/PostsList"
import { AdminControls } from "@/components/community/introductions/AdminControls"
import { PinnedRule } from "@/components/community/PinnedRule"

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
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentRule, setCurrentRule] = useState("")
  const postsPerPage = 10

  useEffect(() => {
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
      const { data } = await supabase
        .from('community_pinned_rules')
        .select('content')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (data) {
        setCurrentRule(data.content)
      }
    }

    checkAdminStatus()
    fetchCurrentRule()
  }, [])

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

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <CandidateHeader />
      <div className="flex flex-1">
        {!isMobile && <CandidateSidebar />}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-3xl mx-auto">
            <IntroductionsHeader isAdmin={isAdmin} />
            
            {isAdmin && (
              <AdminControls 
                currentRule={currentRule} 
                onRuleUpdate={() => fetchCurrentRule()}
              />
            )}
            
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={() => fetchPosts(true)}
            />

            <CommunityBanner />
            <PinnedRule content={currentRule} />
            <CreatePost onPostCreated={() => fetchPosts(true)} />
            
            <div className="space-y-4">
              <PostsList
                posts={posts}
                isLoading={isLoading}
                isLoadingMore={isLoadingMore}
                hasMore={hasMore}
                searchQuery={searchQuery}
                onLoadMore={() => setPage(prev => prev + 1)}
                onLikeChange={() => fetchPosts()}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
