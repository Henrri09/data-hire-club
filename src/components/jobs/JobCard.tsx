import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import supabase from "@/integrations/supabase/client";
import { JobCardHeader } from "./JobCardHeader";
import { JobDetails } from "./JobDetails";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    description: string;
    seniority: string;
    salary_range: string;
    contract_type: string;
    application_url?: string;
  };
}

export function JobCard({ job }: JobCardProps) {
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = () => {
    if (job.application_url) {
      window.open(job.application_url, '_blank');
    }
  };

  const handleAddViewToJob = async () => {
    try {
      // Primeiro busca o job atual
      const { data, error } = await supabase
        .from('jobs')
        .select('views_count')
        .eq('id', job.id)
        .single();

      if (error) {
        console.error('Erro ao buscar job para atualizar visualizações:', error);
        return;
      }

      // Define um valor inicial se for null
      const currentViews = data?.views_count ?? 0;

      // Atualiza o contador incrementando em 1
      const { error: updateError } = await supabase
        .from('jobs')
        .update({ views_count: currentViews + 1 })
        .eq('id', job.id);

      if (updateError) {
        console.error('Erro ao atualizar contagem de visualizações:', updateError);
      } else {
        console.log(`Contagem de visualizações atualizada com sucesso: ${currentViews} -> ${currentViews + 1}`);
      }
    } catch (err) {
      console.error('Erro inesperado ao atualizar visualizações:', err);
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow w-full max-w-2xl mx-auto">
      <JobCardHeader job={job} />

      <Dialog >
        <DialogTrigger asChild>
          <Button
            onClick={handleAddViewToJob}
            className="w-full mt-4 bg-[#7779f5] hover:bg-[#7779f5]/90 text-white transition-colors text-sm md:text-base"
          >
            Ver vaga
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95%] md:max-w-2xl p-4 md:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold text-[#1e293b]">{job.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <JobDetails job={job} />

            <Button
              onClick={handleApply}
              className="w-full mt-6 bg-[#7779f5] hover:bg-[#7779f5]/90 text-white transition-colors flex items-center justify-center gap-2"
            >
              Quero me candidatar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}