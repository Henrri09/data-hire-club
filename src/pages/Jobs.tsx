import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Briefcase } from "lucide-react";

export default function Jobs() {
  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-8">Vagas em Dados</h1>
      
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div>
          <Input placeholder="Buscar vagas..." className="w-full" />
        </div>
        <div>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Modalidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remote">Remoto</SelectItem>
              <SelectItem value="hybrid">Híbrido</SelectItem>
              <SelectItem value="onsite">Presencial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Senioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="junior">Júnior</SelectItem>
              <SelectItem value="mid">Pleno</SelectItem>
              <SelectItem value="senior">Sênior</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((job) => (
          <div key={job} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Analista de Dados Sênior</h3>
                <p className="text-gray-600 mb-4">Empresa Tecnologia LTDA</p>
              </div>
              <Button>Ver vaga</Button>
            </div>
            <div className="flex gap-4 text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                São Paulo, SP
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                Remoto
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}