import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { JobsErrorStateProps } from "@/types/job.types";

export function JobsErrorState({ error }: JobsErrorStateProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erro ao carregar vagas</AlertTitle>
      <AlertDescription>
        {error.message || 'Ocorreu um erro ao carregar as vagas. Tente novamente mais tarde.'}
      </AlertDescription>
    </Alert>
  );
}