import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@supabase/auth-helpers-react";
import { JobListItem } from "./job/JobListItem";
import { useJobsManagement } from "@/hooks/useJobsManagement";
import { Skeleton } from "@/components/ui/skeleton";

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
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhuma vaga publicada ainda.</p>
              <p className="text-sm mt-2">Clique em "Publicar Nova Vaga" para começar.</p>
            </div>
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