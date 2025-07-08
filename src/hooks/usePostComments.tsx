
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  post_id: string;
  author: {
    id: string;
    full_name: string;
    logo_url: string;
  };
}

export const usePostComments = (postId: string) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const queryClient = useQueryClient();

  // Fetch comments
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_post_comments')
        .select(`
          id,
          content,
          created_at,
          updated_at,
          post_id,
          profiles!inner(
            id,
            full_name,
            logo_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data || []).map((comment: any) => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        updated_at: comment.updated_at,
        post_id: comment.post_id,
        author: {
          id: comment.profiles.id,
          full_name: comment.profiles.full_name,
          logo_url: comment.profiles.logo_url || ''
        }
      })) as Comment[];
    },
    enabled: showComments
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('community_post_comments')
        .insert([
          {
            content,
            post_id: postId,
            author_id: user.id
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setNewComment('');
      toast.success('Comentário adicionado com sucesso!');
    },
    onError: (error) => {
      console.error('Error adding comment:', error);
      toast.error('Erro ao adicionar comentário');
    }
  });

  const handleAddComment = () => {
    if (newComment.trim()) {
      addCommentMutation.mutate(newComment.trim());
    }
  };

  return {
    comments,
    isLoading,
    showComments,
    setShowComments,
    newComment,
    setNewComment,
    handleAddComment,
    isAddingComment: addCommentMutation.isPending
  };
};
