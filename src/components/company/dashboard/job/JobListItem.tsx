import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, MoreVertical, Trash2, Eye, Users } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { JobEditDialog } from "./JobEditDialog";
import { Badge } from "@/components/ui/badge";

interface Job {
  id: string;
  title: string;
  status: string;
  applications_count: number;
  views_count?: number;
  created_at?: string;
}

interface JobListItemProps {
  job: Job;
  onStatusChange: (jobId: string, newStatus: string) => void;
  onDelete: (jobId: string) => void;
  onEdit: (formData: any) => void;
}

export function JobListItem({ job, onStatusChange, onDelete, onEdit }: JobListItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{job.title}</h3>
            <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
              {job.status === 'active' ? 'Ativa' : 'Inativa'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {job.applications_count} candidatura{job.applications_count !== 1 ? 's' : ''}
            </div>
            {job.views_count !== undefined && (
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {job.views_count} visualizaç{job.views_count !== 1 ? 'ões' : 'ão'}
              </div>
            )}
            {job.created_at && (
              <div>
                Publicada em {formatDate(job.created_at)}
              </div>
            )}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onSelect={(e) => {
                e.preventDefault();
                setIsEditDialogOpen(true);
              }}
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onSelect={() => onStatusChange(job.id, job.status === 'active' ? 'inactive' : 'active')}
            >
              {job.status === 'active' ? 'Desativar' : 'Ativar'}
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="text-red-600"
              onSelect={() => onDelete(job.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <JobEditDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        job={job}
        onSubmit={onEdit}
      />
    </div>
  );
}