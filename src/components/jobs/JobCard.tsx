import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { JobCardHeader } from "./JobCardHeader";
import { JobDetails } from "./JobDetails";
import { JobApplicationForm } from "./JobApplicationForm";

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

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow w-full max-w-2xl mx-auto">
      <JobCardHeader job={job} />
      
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            className="w-full mt-4 bg-[#7779f5] hover:bg-[#9b87f5] text-white transition-colors text-sm md:text-base"
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
            
            {isApplying ? (
              <JobApplicationForm
                jobId={job.id}
                onCancel={() => setIsApplying(false)}
                onSuccess={() => {
                  setIsApplying(false);
                }}
              />
            ) : (
              <Button 
                onClick={() => setIsApplying(true)}
                className="w-full mt-6 bg-[#7779f5] hover:bg-[#9b87f5] text-white transition-colors flex items-center justify-center gap-2"
              >
                Apply for this position
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}