import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@supabase/auth-helpers-react";
import { JobListItem } from "./job/JobListItem";
import { useJobsManagement } from "@/hooks/useJobsManagement";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function JobsTab() {
  const user = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
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
            <>
              <div className="space-y-4">
                {currentJobs.map((job) => (
                  <JobListItem
                    key={job.id}
                    job={job}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}