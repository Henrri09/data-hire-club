import { CreatePost } from "@/components/community/CreatePost"
import { PostCard } from "@/components/community/PostCard"
import { CandidateHeader } from "@/components/candidate/Header"
import { CandidateSidebar } from "@/components/candidate/Sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { CommunityBanner } from "@/components/community/CommunityBanner"
import { Button } from "@/components/ui/button"
import { Settings2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AdminBannerDialog } from "@/components/community/admin/AdminBannerDialog"
import { AdminRulesDialog } from "@/components/community/admin/AdminRulesDialog"

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
  const [showBannerDialog, setShowBannerDialog] = useState(false)
  const [showRulesDialog, setShowRulesDialog] = useState(false)

  useEffect(() => {
    fetchPosts()
    checkAdminStatus()
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

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <CandidateHeader />
      <div className="flex flex-1">
        {!isMobile && <CandidateSidebar />}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">O que você está aprendendo?</h1>
              {isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Settings2 className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowBannerDialog(true)}>
                      Gerenciar Banner
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowRulesDialog(true)}>
                      Gerenciar Regras
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <CommunityBanner />
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

      <AdminBannerDialog 
        open={showBannerDialog} 
        onOpenChange={setShowBannerDialog} 
      />
      
      <AdminRulesDialog
        open={showRulesDialog}
        onOpenChange={setShowRulesDialog}
      />
    </div>
  )
}