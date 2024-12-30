import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@supabase/auth-helpers-react";
import type { User } from "@supabase/supabase-js";
import { JobListItem } from "./job/JobListItem";
import { useJobsManagement } from "@/hooks/useJobsManagement";

export function JobsTab() {
  const { user } = useUser() as { user: User | null };
  const {
    jobs,
    fetchJobs,
    handleStatusChange,
    handleDelete,
    handleEdit
  } = useJobsManagement(user?.id);

  useEffect(() => {
    if (user?.id) {
      fetchJobs();
    }
  }, [user?.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Minhas Vagas</CardTitle>
        <CardDescription>
          Gerencie suas vagas publicadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobListItem
              key={job.id}
              job={job}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}