
import { Post } from './community.types';
import { Comment } from './comment.types';

export interface PostCardProps {
  post: Post;
  onLikeChange?: () => void;
  onPostDelete?: () => void;
}

export interface PostHeaderProps {
  post: Post;
}

export interface PostEditDialogProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => Promise<void>;
}

export interface PostDeleteButtonProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export interface CommunityHeaderProps {
  title: string;
  description?: string;
}

export interface PinnedRuleProps {
  content: string;
}

export interface CreatePostProps {
  type?: string;
  placeholder: string;
  onPostSuccess: () => Promise<void>;
}

export interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export interface PostsListProps {
  posts: Post[];
  loading: boolean;
  onPostUpdate: () => Promise<void>;
}
