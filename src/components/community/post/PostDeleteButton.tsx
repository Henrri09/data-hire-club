import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PostDeleteButtonProps {
  postId: string;
  authorId: string;
  isAdmin: boolean;
  onPostDelete?: () => void;
}

export function PostDeleteButton({ 
  postId, 
  authorId, 
  isAdmin,
  onPostDelete 
}: PostDeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      console.log('Attempting to delete post:', postId);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Current user:', user.id);
      console.log('Post author:', authorId);
      console.log('Is admin:', isAdmin);

      // Verificar se o usuário é o autor do post ou é admin
      if (user.id !== authorId && !isAdmin) {
        throw new Error('Unauthorized to delete this post');
      }

      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId);

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }

      toast({
        title: "Post removido",
        description: "O post foi removido com sucesso.",
      });
      
      if (onPostDelete) {
        onPostDelete();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Erro ao remover post",
        description: "Ocorreu um erro ao tentar remover o post.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}