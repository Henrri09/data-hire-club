import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface JobApplicationFormProps {
  jobId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export function JobApplicationForm({ jobId, onCancel, onSuccess }: JobApplicationFormProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const { toast } = useToast();

  const handleApply = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to apply for jobs",
          variant: "destructive",
        });
        return;
      }

      // Get candidate profile
      const { data: candidateData, error: candidateError } = await supabase
        .from('candidates')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (candidateError || !candidateData) {
        toast({
          title: "Profile required",
          description: "Please complete your candidate profile first",
          variant: "destructive",
        });
        return;
      }

      // Submit application
      const { error: applicationError } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          candidate_id: candidateData.id,
          cover_letter: coverLetter,
          status: 'pending'
        });

      if (applicationError) {
        if (applicationError.code === '23505') { // Unique violation
          toast({
            title: "Already applied",
            description: "You have already applied to this job",
            variant: "destructive",
          });
        } else {
          throw applicationError;
        }
        return;
      }

      toast({
        title: "Application submitted",
        description: "Your application has been sent successfully",
      });

      onSuccess();
    } catch (error) {
      console.error('Application error:', error);
      toast({
        title: "Application failed",
        description: "There was an error submitting your application",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Write your cover letter..."
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
        className="min-h-[200px]"
      />
      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          onClick={handleApply}
          className="bg-[#7779f5] hover:bg-[#9b87f5] text-white"
        >
          Submit Application
        </Button>
      </div>
    </div>
  );
}