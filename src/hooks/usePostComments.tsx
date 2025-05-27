
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import supabase from '@/integrations/supabase/client';
import { Comment } from '@/types/comment.types';

export function usePostComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const { toast } = useToast();

  const fetchComments = useCallback(async () => {
    if (!postId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('community_post_comments')
        .select(`
          id,
          content,
          created_at,
          updated_at,
          profiles!community_post_comments_author_id_fkey (
            id,
            full_name,
            logo_url
          )
        `)
        .eq('post_id', postId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const commentsWithAuthor: Comment[] = (data || []).map(comment => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        updated_at: comment.updated_at,
        author: {
          id: comment.profiles?.id || '',
          full_name: comment.profiles?.full_name || 'Usuário anônimo',
          logo_url: comment.profiles?.logo_url || undefined
        }
      }));

      setComments(commentsWithAuthor);
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os comentários',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [postId, toast]);

  const handleComment = useCallback(async (content: string) => {
    if (!content.trim() || !postId) return;

    setLoadingAdd(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { error } = await supabase
        .from('community_post_comments')
        .insert({
          post_id: postId,
          author_id: user.id,
          content: content.trim()
        });

      if (error) throw error;

      toast({
        title: 'Comentário adicionado',
        description: 'Seu comentário foi publicado com sucesso',
      });

      await fetchComments();
    } catch (error: any) {
      console.error('Erro ao adicionar comentário:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível adicionar o comentário',
        variant: 'destructive',
      });
    } finally {
      setLoadingAdd(false);
    }
  }, [postId, fetchComments, toast]);

  return {
    comments,
    loading,
    loadingAdd,
    fetchComments,
    handleComment
  };
}
