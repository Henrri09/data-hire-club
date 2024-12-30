import { Dialog, DialogContent } from "@/components/ui/dialog";
import { JobPostingForm } from "../JobPostingForm";
import { useState } from "react";

interface JobEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: any;
  onSubmit: (formData: any) => void;
  isSubmitting?: boolean;
}

export function JobEditDialog({ 
  open, 
  onOpenChange, 
  job, 
  onSubmit,
  isSubmitting = false 
}: JobEditDialogProps) {
  const [formData, setFormData] = useState({
    titulo: job.title || "",
    descricao: job.description || "",
    local: job.location || "",
    senioridade: job.experience_level || "",
    tipoContratacao: job.contract_type || "",
    faixaSalarialMin: job.salary_range?.split("-")[0]?.trim() || "",
    faixaSalarialMax: job.salary_range?.split("-")[1]?.trim() || "",
    linkExterno: job.external_link || "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: job.id
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <JobPostingForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}