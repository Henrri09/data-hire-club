
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CandidateHeader } from '@/components/candidate/Header';
import { CandidateSidebar } from '@/components/candidate/Sidebar';
import { CommunityHeader } from '@/components/community/CommunityHeader';
import { CommunityBanner } from '@/components/community/CommunityBanner';
import { PinnedRule } from '@/components/community/PinnedRule';
import { CreatePost } from '@/components/community/CreatePost';
import { SearchBar } from '@/components/community/introductions/SearchBar';
import { PostsList } from '@/components/community/introductions/PostsList';
import { AdminControls } from '@/components/community/introductions/AdminControls';
import { Post } from '@/types/community.types';
import { useIsMobile } from '@/hooks/use-mobile';

const Introductions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();

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
        .from('community_posts')
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
    <div className="min-h-screen bg-[#f8fafc]">
      <CandidateHeader />
      <div className="flex">
        {!isMobile && <CandidateSidebar />}
        <main className="flex-1 py-6 px-4 md:py-8 md:px-8">
          <div className="max-w-4xl mx-auto bg-gray-50 rounded-lg p-6 md:p-8">
            <CommunityHeader 
              title="Apresentações" 
              description="Compartilhe sua jornada na área de dados e conheça outros profissionais"
            />

            <CommunityBanner type="INTRODUCTION" />
            
            <PinnedRule content="📝 Use este espaço para se apresentar à comunidade! Conte sobre sua experiência, área de interesse e objetivos profissionais." />

            <AdminControls type="INTRODUCTION" />

            <CreatePost 
              onPostSuccess={handlePostSuccess}
              placeholder="Compartilhe sua apresentação com a comunidade..."
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
        </main>
      </div>
    </div>
  );
};

export default Introductions;
