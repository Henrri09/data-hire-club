
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CommunityHeader } from '@/components/community/CommunityHeader';
import { CommunityBanner } from '@/components/community/CommunityBanner';
import { PinnedRule } from '@/components/community/PinnedRule';
import { CreatePost } from '@/components/community/CreatePost';
import { SearchBar } from '@/components/community/introductions/SearchBar';
import { PostsList } from '@/components/community/introductions/PostsList';
import { AdminControls } from '@/components/community/introductions/AdminControls';
import { Header } from '@/components/candidate/Header';
import { Post } from '@/types/community.types';

const Introductions = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch posts for introductions
  const { 
    data: posts = [], 
    isLoading, 
    refetch: refetchPosts 
  } = useQuery({
    queryKey: ['introductions-posts', searchTerm],
    queryFn: async () => {
      console.log('Fetching introduction posts...');
      
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
        .eq('type', 'introduction')
        .order('created_at', { ascending: false });

      if (searchTerm.trim()) {
        query = query.ilike('content', `%${searchTerm}%`);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <CommunityHeader 
          title="Apresentações" 
          description="Compartilhe sua jornada na área de dados e conheça outros profissionais"
        />

        <CommunityBanner />
        
        <PinnedRule content="📝 Use este espaço para se apresentar à comunidade! Conte sobre sua experiência, área de interesse e objetivos profissionais." />

        <AdminControls />

        <CreatePost 
          placeholder="Compartilhe sua apresentação com a comunidade..."
          onPostSuccess={handlePostSuccess}
        />

        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <PostsList 
          posts={posts}
          loading={isLoading}
          onPostUpdate={handlePostUpdate}
        />
      </div>
    </div>
  );
};

export default Introductions;
