
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import supabase from '@/integrations/supabase/client';
import { CommunityHeader } from '@/components/community/CommunityHeader';
import { CommunityBanner } from '@/components/community/CommunityBanner';
import { PinnedRule } from '@/components/community/PinnedRule';
import { CreatePost } from '@/components/community/CreatePost';
import { PostCard } from '@/components/community/PostCard';
import { PostSkeleton } from '@/components/community/PostSkeleton';
import { Post } from '@/types/community.types';

const Learning = () => {
  // Fetch posts for learning
  const { 
    data: posts = [], 
    isLoading, 
    refetch: refetchPosts 
  } = useQuery({
    queryKey: ['learning-posts'],
    queryFn: async () => {
      console.log('Fetching learning posts...');
      
      const { data, error } = await supabase
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
        .eq('type', 'learning')
        .order('created_at', { ascending: false });

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
          logo_url: post.profiles.logo_url || ''
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <CommunityHeader 
          title="Aprendizado" 
          description="Compartilhe recursos, dicas e experiências de aprendizado em dados"
        />

        <CommunityBanner type="LEARNING" />
        
        <PinnedRule content="📚 Compartilhe cursos, livros, artigos e dicas que ajudaram em sua jornada de aprendizado!" />

        <CreatePost 
          onPostSuccess={handlePostSuccess}
          placeholder="Compartilhe um recurso de aprendizado ou dica..."
        />

        {/* Posts */}
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <PostSkeleton key={index} />
            ))
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLikeChange={handlePostUpdate}
                onPostDelete={handlePostUpdate}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Ainda não há posts de aprendizado. Seja o primeiro a compartilhar!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Learning;
