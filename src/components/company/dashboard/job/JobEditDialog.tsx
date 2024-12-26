import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { JobPostingForm } from "../JobPostingForm";

interface JobEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: any;
  onSubmit: (formData: any) => void;
}

export function JobEditDialog({ open, onOpenChange, job, onSubmit }: JobEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Vaga</DialogTitle>
        </DialogHeader>
        <JobPostingForm
          formData={{
            titulo: job.title,
            descricao: "",
            local: "",
            senioridade: "",
            tipoContratacao: "",
            faixaSalarialMin: "",
            faixaSalarialMax: "",
            linkExterno: "",
          }}
          handleInputChange={() => {}}
          handleSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}