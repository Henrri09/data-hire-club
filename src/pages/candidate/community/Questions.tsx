
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import supabase from '@/integrations/supabase/client';
import { CommunityHeader } from '@/components/community/CommunityHeader';
import { CommunityBanner } from '@/components/community/CommunityBanner';
import { PinnedRule } from '@/components/community/PinnedRule';
import { CreatePost } from '@/components/community/CreatePost';
import { PostCard } from '@/components/community/PostCard';
import { PostSkeleton } from '@/components/community/PostSkeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Post } from '@/types/community.types';

const Questions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const postsPerPage = 10;

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1); // Reset to first page when searching
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch posts for questions
  const { 
    data: posts = [], 
    isLoading, 
    refetch: refetchPosts 
  } = useQuery({
    queryKey: ['questions-posts', debouncedSearchQuery, page],
    queryFn: async () => {
      console.log('Fetching questions posts...');
      
      let query = supabase
        .from('posts')
        .select(`
          id,
          content,
          created_at,
          updated_at,
          likes_count,
          comments_count,
          profiles!inner(
            id,
            full_name,
            logo_url
          ),
          user_likes!left(
            user_id
          )
        `)
        .eq('type', 'question')
        .order('created_at', { ascending: false })
        .range((page - 1) * postsPerPage, page * postsPerPage - 1);

      if (debouncedSearchQuery.trim()) {
        query = query.ilike('content', `%${debouncedSearchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }

      console.log('Fetched posts:', data);

      const { data: { user } } = await supabase.auth.getUser();
      
      const formattedPosts = (data || []).map((post: any) => ({
        id: post.id,
        content: post.content,
        created_at: post.created_at,
        updated_at: post.updated_at,
        likes_count: post.likes_count || 0,
        comments_count: post.comments_count || 0,
        author: {
          id: post.profiles.id,
          full_name: post.profiles.full_name,
          logo_url: post.profiles.logo_url
        },
        is_liked: user ? post.user_likes?.some((like: any) => like.user_id === user.id) : false
      })) as Post[];

      return formattedPosts;
    }
  });

  const handlePostSuccess = async () => {
    await refetchPosts();
  };

  const handlePostUpdate = async () => {
    await refetchPosts();
  };

  const handleSearch = async () => {
    setPage(1);
    await refetchPosts();
  };

  const loadMore = async () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <CommunityHeader title="Perguntas e Respostas" />

        <CommunityBanner type="QUESTIONS" />
        
        <PinnedRule content="❓ Faça suas perguntas sobre carreira, tecnologias e desafios na área de dados. A comunidade está aqui para ajudar!" />

        <CreatePost 
          placeholder="Faça sua pergunta para a comunidade..."
          onPostSuccess={handlePostSuccess}
        />

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar perguntas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <PostSkeleton key={index} />
            ))
          ) : posts.length > 0 ? (
            <>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLikeChange={handlePostUpdate}
                  onPostDelete={handlePostUpdate}
                />
              ))}
              
              {posts.length === postsPerPage && (
                <div className="text-center py-4">
                  <Button 
                    onClick={loadMore}
                    variant="outline"
                    disabled={isLoading}
                  >
                    Carregar mais
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {debouncedSearchQuery 
                ? 'Nenhuma pergunta encontrada com esse termo.'
                : 'Ainda não há perguntas. Seja o primeiro a perguntar!'
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questions;
