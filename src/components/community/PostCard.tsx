
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Pencil, Trash2 } from 'lucide-react';
import { PostHeader } from './PostHeader';
import { PostContent } from './post/PostContent';
import { PostComments } from './PostComments';
import { PostEditDialog } from './post/PostEditDialog';
import { PostDeleteButton } from './post/PostDeleteButton';
import { usePostActions } from '@/hooks/usePostActions';
import { usePostComments } from '@/hooks/usePostComments';
import { Post } from '@/types/community.types';

interface PostCardProps {
  post: Post;
  onUpdate: () => Promise<void>;
  onDelete?: () => void;
}

export function PostCard({ post, onUpdate, onDelete }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { 
    isLiked, 
    likesCount, 
    toggleLike, 
    isLoading: isLikeLoading 
  } = usePostActions(post);

  const {
    comments,
    loading: commentsLoading,
    loadingAdd: addingComment,
    fetchComments,
    handleComment
  } = usePostComments(post.id);

  const handleToggleComments = async () => {
    if (!showComments) {
      await fetchComments();
    }
    setShowComments(!showComments);
  };

  const handleCommentSubmit = async (content: string) => {
    await handleComment(content);
    await fetchComments();
  };

  return (
    <>
      <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <PostHeader post={post} />
        </CardHeader>
        
        <CardContent className="space-y-4">
          <PostContent content={post.content} />
          
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLike}
                disabled={isLikeLoading}
                className={`flex items-center space-x-1 ${
                  isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likesCount}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleComments}
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments_count || 0}</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditDialog(true)}
                className="text-gray-500 hover:text-blue-500"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="text-gray-500 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {showComments && (
            <PostComments
              comments={comments}
              loading={commentsLoading}
              onAddComment={handleCommentSubmit}
              loadingAdd={addingComment}
            />
          )}
        </CardContent>
      </Card>

      <PostEditDialog
        post={post}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={onUpdate}
      />

      <PostDeleteButton
        post={post}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onSuccess={() => {
          onUpdate();
          if (onDelete) onDelete();
        }}
      />
    </>
  );
}
