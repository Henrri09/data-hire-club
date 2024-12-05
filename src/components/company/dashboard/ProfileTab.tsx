import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil da Empresa</CardTitle>
        <CardDescription>
          Gerencie as informações da sua empresa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="editCompanyName">Nome da Empresa</Label>
              <Input id="editCompanyName" defaultValue="TechBR Solutions" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editCnpj">CNPJ</Label>
              <Input id="editCnpj" defaultValue="00.000.000/0000-00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editSector">Setor</Label>
              <Input id="editSector" defaultValue="Tecnologia" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editLocation">Localização</Label>
              <Input id="editLocation" defaultValue="São Paulo, SP" />
            </div>
          </div>
          <Button type="submit" className="bg-[#7779f5] hover:bg-[#7779f5]/90">
            Salvar Alterações
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}