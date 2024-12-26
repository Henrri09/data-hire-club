import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, MoreVertical, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { JobEditDialog } from "./JobEditDialog";

interface Job {
  id: string;
  title: string;
  status: string;
  applications_count: number;
}

interface JobListItemProps {
  job: Job;
  onStatusChange: (jobId: string, newStatus: string) => void;
  onDelete: (jobId: string) => void;
  onEdit: (formData: any) => void;
}

export function JobListItem({ job, onStatusChange, onDelete, onEdit }: JobListItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{job.title}</h3>
          <p className="text-sm text-gray-600">
            {job.applications_count} candidatura{job.applications_count !== 1 ? 's' : ''}
          </p>
          <span className={`text-sm ${
            job.status === 'active' ? 'text-green-600' : 'text-gray-600'
          }`}>
            {job.status === 'active' ? 'Ativa' : 'Inativa'}
          </span>
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