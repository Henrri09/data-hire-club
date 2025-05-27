
export interface CommentAuthor {
  id: string;
  full_name: string;
  logo_url?: string;
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  author: CommentAuthor;
  post_id?: string;
}
