
import { PostCard } from "@/components/community/PostCard"
import { Button } from "@/components/ui/button"

interface PostAuthor {
  id: string;
  full_name: string | null;
  logo_url?: string | null;
}

interface Post {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  author: PostAuthor;
  is_liked?: boolean;
}

interface PostsListProps {
  posts: Post[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  searchQuery: string;
  onLoadMore: () => void;
  onLikeChange: () => void;
  onPostDelete?: () => void;
}

export function PostsList({
  posts,
  isLoading,
  isLoadingMore,
  hasMore,
  searchQuery,
  onLoadMore,
  onLikeChange,
  onPostDelete,
}: PostsListProps) {
  if (posts.length === 0) {
    return (
      <p className="text-center text-gray-500">
        {searchQuery
          ? "Nenhum post encontrado para sua busca."
          : "Nenhum post encontrado. Seja o primeiro a se apresentar!"}
      </p>
    )
  }

  // Remover possíveis duplicatas baseado no ID
  const uniquePosts = Array.from(new Map(posts.map(post => [post.id, post])).values())

  return (
    <>
      {uniquePosts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          author={{
            name: post.author?.full_name || 'Usuário Anônimo',
            id: post.author?.id || '',
            avatar: post.author?.logo_url
          }}
          content={post.content}
          likes={post.likes_count}
          comments={post.comments_count}
          created_at={post.created_at}
          isLiked={post.is_liked}
          onLikeChange={onLikeChange}
          onPostDelete={onPostDelete}
        />
      ))}

      {hasMore && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? "Carregando..." : "Carregar mais"}
          </Button>
        </div>
      )}
    </>
  )
}
