
export interface Post {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  is_liked?: boolean;
  author: {
    id: string;
    full_name: string;
    logo_url?: string;
  };
}

export interface PostAuthor {
  id: string;
  full_name: string | null;
  logo_url?: string | null;
}

export interface CommunityPost {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  author: PostAuthor;
  is_liked?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    full_name: string;
    logo_url?: string;
  };
}

export interface CreatePostProps {
  onSuccess: () => Promise<void>;
  placeholder?: string;
}
