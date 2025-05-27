
import { PostCard } from "@/components/community/PostCard"
import { PostSkeleton } from "@/components/community/PostSkeleton"
import { Post } from "@/types/community.types"

interface PostsListProps {
  posts: Post[];
  loading: boolean;
  onPostUpdate: () => Promise<void>;
}

export function PostsList({
  posts,
  loading,
  onPostUpdate,
}: PostsListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <PostSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <p className="text-center text-gray-500">
        Nenhum post encontrado. Seja o primeiro a se apresentar!
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLikeChange={onPostUpdate}
          onPostDelete={onPostUpdate}
        />
      ))}
    </div>
  )
}
