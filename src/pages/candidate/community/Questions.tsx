import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { CommunityBanner } from "@/components/community/CommunityBanner"
import { CandidateHeader } from "@/components/candidate/Header"
import { CandidateSidebar } from "@/components/candidate/Sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { AdminControls } from "@/components/community/introductions/AdminControls"
import { CreatePost } from "@/components/community/CreatePost"
import { PostsList } from "@/components/community/introductions/PostsList"
import { PinnedRule } from "@/components/community/PinnedRule"

export default function Questions() {
  const isMobile = useIsMobile()
  const [isAdmin, setIsAdmin] = useState(false)
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentRule, setCurrentRule] = useState("")

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

    checkAdminStatus()
    loadPosts()
    fetchCurrentRule()
  }, [])

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

  const loadPosts = async () => {
    try {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      const baseQuery = supabase
        .from('community_posts')
        .select(user ? `
          id,
          content,
          created_at,
          likes_count,
          comments_count,
          author:profiles(id, full_name),
          is_liked:community_post_likes!inner(id)
        ` : `
          id,
          content,
          created_at,
          likes_count,
          comments_count,
          author:profiles(id, full_name)
        `)
        .eq('post_type', 'question')
        .order('created_at', { ascending: false })
        .limit(10)

      const query = searchQuery
        ? baseQuery.ilike('content', `%${searchQuery}%`)
        : baseQuery

      const { data, error } = await query

      if (error) throw error

      setPosts(data || [])
      setHasMore(data?.length === 10)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMore = async () => {
    if (!hasMore || isLoadingMore) return

    try {
      setIsLoadingMore(true)
      const lastPost = posts[posts.length - 1]
      const { data: { user } } = await supabase.auth.getUser()

      const baseQuery = supabase
        .from('community_posts')
        .select(user ? `
          id,
          content,
          created_at,
          likes_count,
          comments_count,
          author:profiles(id, full_name),
          is_liked:community_post_likes!inner(id)
        ` : `
          id,
          content,
          created_at,
          likes_count,
          comments_count,
          author:profiles(id, full_name)
        `)
        .eq('post_type', 'question')
        .order('created_at', { ascending: false })
        .lt('created_at', lastPost.created_at)
        .limit(10)

      const query = searchQuery
        ? baseQuery.ilike('content', `%${searchQuery}%`)
        : baseQuery

      const { data, error } = await query

      if (error) throw error

      setPosts(prev => [...prev, ...(data || [])])
      setHasMore(data?.length === 10)
    } catch (error) {
      console.error('Error loading more posts:', error)
    } finally {
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
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Tire suas Dúvidas</h1>
            </div>

            <CommunityBanner type="QUESTIONS" />
            <PinnedRule content={currentRule} />

            {isAdmin && (
              <AdminControls
                currentRule={currentRule}
                onRuleUpdate={fetchCurrentRule}
                type="QUESTIONS"
              />
            )}
            <PinnedRule content={currentRule} />

            <div className="mt-6">
              <CreatePost onPostCreated={loadPosts} />
              <PostsList
                posts={posts}
                isLoading={isLoading}
                isLoadingMore={isLoadingMore}
                hasMore={hasMore}
                searchQuery={searchQuery}
                onLoadMore={loadMore}
                onLikeChange={loadPosts}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}