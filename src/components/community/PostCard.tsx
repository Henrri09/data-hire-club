
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Heart, MessageCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PostComments } from './PostComments';
import { PostEditDialog } from './post/PostEditDialog';
import { PostDeleteButton } from './post/PostDeleteButton';
import { usePostActions } from '@/hooks/usePostActions';
import { usePostComments } from '@/hooks/usePostComments';
import { PostCardProps } from '@/types/community-props.types';

export const PostCard = ({ post, onLikeChange, onPostDelete }: PostCardProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { isLiked, likesCount, toggleLike, isLoading } = usePostActions({
    postId: post.id,
    initialLiked: post.is_liked || false,
    initialLikes: post.likes_count,
    onLikeChange
  });

  const {
    comments,
    isLoading: isLoadingComments,
    showComments,
    setShowComments,
    newComment,
    setNewComment,
    handleAddComment,
    isAddingComment
  } = usePostComments(post.id);

  const handleEditSuccess = async () => {
    if (onLikeChange) {
      await onLikeChange();
    }
  };

  const handleDeleteSuccess = () => {
    if (onPostDelete) {
      onPostDelete();
    }
  };

  return (
    <>
      <Card className="mb-4">
        <CardContent className="p-6">
          {/* Post Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.logo_url || ''} />
                <AvatarFallback>
                  {post.author.full_name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900">
                  {post.author.full_name || 'Usuário'}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                    locale: ptBR
                  })}
                </p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Post Content */}
          <div className="mb-4">
            <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Post Actions */}
          <div className="flex items-center gap-4 pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLike}
              disabled={isLoading}
              className={`flex items-center gap-2 ${
                isLiked ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              <Heart 
                className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} 
              />
              <span>{likesCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-gray-500"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments_count}</span>
            </Button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <PostComments
              comments={comments}
              isLoading={isLoadingComments}
              newComment={newComment}
              onCommentChange={setNewComment}
              onSubmitComment={handleAddComment}
              isSubmitting={isAddingComment}
            />
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <PostEditDialog
        post={post}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Dialog */}
      <PostDeleteButton
        post={post}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
};
