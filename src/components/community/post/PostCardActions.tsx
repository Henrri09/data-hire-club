import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"

interface PostCardActionsProps {
  isCurrentUser: boolean
  isAdmin: boolean
  isDeleting: boolean
  onEdit: () => void
  onDelete: () => void
}

export function PostCardActions({
  isCurrentUser,
  isAdmin,
  isDeleting,
  onEdit,
  onDelete
}: PostCardActionsProps) {
  if (!isCurrentUser && !isAdmin) return null

  return (
    <div className="flex gap-2">
      {isCurrentUser && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  )
}