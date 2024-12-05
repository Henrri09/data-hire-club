import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function JobsTab() {
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
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold">Analista de Dados Sênior</h3>
            <p className="text-sm text-gray-600">4 candidaturas</p>
            <div className="mt-2 flex gap-2">
              <Button variant="outline" size="sm">Editar</Button>
              <Button variant="outline" size="sm">Ver Candidatos</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}