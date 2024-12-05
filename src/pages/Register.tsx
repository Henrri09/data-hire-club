import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md mx-auto relative">
        <Link 
          to="/" 
          className="absolute left-4 top-4 text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar para home
        </Link>
        <CardHeader className="pt-12 space-y-2">
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
                <SelectTrigger>
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
              <Input id="name" placeholder="Seu nome completo" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full bg-[#7779f5] hover:bg-[#7779f5]/90">
              Cadastrar
            </Button>
            <p className="text-center text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-[#7779f5] hover:underline">
                Entrar
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}