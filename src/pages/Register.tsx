import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function Register() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Gradient Section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] p-12 text-white flex-col justify-center">
        <Link 
          to="/" 
          className="absolute left-4 top-4 text-white hover:text-gray-200 flex items-center gap-1 text-sm"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar para home
        </Link>
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold mb-6">Comece sua jornada</h1>
          <p className="text-2xl mb-8">Junte-se a milhares de profissionais e empresas.</p>
          <p className="text-xl opacity-90">
            Encontre as melhores oportunidades em dados ou os melhores talentos para sua empresa.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <Card className="w-full max-w-md border-none shadow-none bg-transparent">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl md:text-3xl text-center">Criar conta</CardTitle>
            <CardDescription className="text-center">
              Cadastre-se para encontrar as melhores oportunidades em dados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userType">Tipo de conta</Label>
                <Select>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Selecione o tipo de conta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="candidate">Candidato</SelectItem>
                    <SelectItem value="company">Empresa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input 
                  id="name" 
                  placeholder="Seu nome completo"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu@email.com"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  className="bg-white"
                />
              </div>
              <Button type="submit" className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED]">
                Cadastrar
              </Button>
              <p className="text-center text-sm text-gray-600">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-[#8B5CF6] hover:underline">
                  Entrar
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}