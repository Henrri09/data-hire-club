
import { PostCard } from "@/components/community/PostCard"
import { Button } from "@/components/ui/button"
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
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 h-32 rounded-lg"></div>
          </div>
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
          onUpdate={onPostUpdate}
        />
      ))}
    </div>
  )
}
