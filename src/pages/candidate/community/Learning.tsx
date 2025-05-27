
import { useState, useEffect } from 'react';
import { CandidateSidebar } from '@/components/candidate/Sidebar';
import { CandidateHeader } from '@/components/candidate/Header';
import { CommunityHeader } from '@/components/community/CommunityHeader';
import { CommunityBanner } from '@/components/community/CommunityBanner';
import { PinnedRule } from '@/components/community/PinnedRule';
import { CreatePost } from '@/components/community/CreatePost';
import { PostCard } from '@/components/community/PostCard';
import { PostSkeleton } from '@/components/community/PostSkeleton';
import { AdminControls } from '@/components/community/introductions/AdminControls';
import { useToast } from '@/hooks/use-toast';
import supabase from '@/integrations/supabase/client';

interface Post {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  author: {
    id: string;
    full_name: string;
    logo_url?: string;
  };
}

export default function Learning() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
    fetchPosts();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        
        setIsAdmin(profile?.is_admin || false);
      }
    } catch (error) {
      console.error('Erro ao verificar status admin:', error);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          id,
          content,
          created_at,
          updated_at,
          likes_count,
          comments_count,
          profiles!community_posts_author_id_fkey (
            id,
            full_name,
            logo_url
          )
        `)
        .eq('post_type', 'learning')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const postsWithAuthor: Post[] = (data || []).map(post => ({
        id: post.id,
        content: post.content,
        created_at: post.created_at,
        updated_at: post.updated_at,
        likes_count: post.likes_count || 0,
        comments_count: post.comments_count || 0,
        author: {
          id: post.profiles?.id || '',
          full_name: post.profiles?.full_name || 'Usuário anônimo',
          logo_url: post.profiles?.logo_url || undefined
        }
      }));

      setPosts(postsWithAuthor);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os posts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <CandidateSidebar />
      <div className="flex-1 pl-64">
        <CandidateHeader />
        <main className="p-6">
          <CommunityHeader
            title="Aprendizado"
            description="Compartilhe materiais de estudo, cursos e dicas para desenvolvimento profissional"
          />
          
          <div className="max-w-4xl mx-auto space-y-6">
            <CommunityBanner type="LEARNING" />
            
            <PinnedRule />
            
            {isAdmin && <AdminControls type="LEARNING" />}
            
            <CreatePost
              type="learning"
              placeholder="Compartilhe materiais de estudo, cursos, tutoriais ou dicas de aprendizado..."
              onPostSuccess={fetchPosts}
            />
            
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <PostSkeleton key={index} />
                ))
              ) : posts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum post de aprendizado ainda.</p>
                  <p>Seja o primeiro a compartilhar um material de estudo!</p>
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onUpdate={fetchPosts}
                  />
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
