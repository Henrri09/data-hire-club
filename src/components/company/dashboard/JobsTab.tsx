import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@supabase/auth-helpers-react";
import { JobListItem } from "./job/JobListItem";
import { useJobsManagement } from "@/hooks/useJobsManagement";

export function JobsTab() {
  const user = useUser();
  const {
    jobs,
    fetchJobs,
    handleStatusChange,
    handleDelete,
    handleEdit,
    isLoading
  } = useJobsManagement(user?.id);

  useEffect(() => {
    if (user?.id) {
      console.log('Fetching jobs for user:', user.id);
      fetchJobs();
    }
  }, [user?.id, fetchJobs]);

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
          {isLoading ? (
            <p>Carregando vagas...</p>
          ) : jobs.length === 0 ? (
            <p>Nenhuma vaga publicada ainda.</p>
          ) : (
            jobs.map((job) => (
              <JobListItem
                key={job.id}
                job={job}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}