import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import BrevoService from "@/services/BrevoService";

const brevoIdListByUserType = {
  candidate: 4,
  company: 3
}

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    companyName: "",
    userType: "candidate"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Preparar os metadados do usuário - sem company_name
      const userData: {
        full_name: string;
        user_type: string;
      } = {
        full_name: formData.fullName,
        user_type: formData.userType,
      };

      // Registrar o usuário com metadados consistentes
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: userData
        }
      });

      if (error) throw error;

      const { data: profileData } = await supabase.from('profiles').insert({
        id: data.user?.id,
        full_name: formData.fullName,
        user_type: formData.userType,
        email: formData.email,
      }).select('id').single();

      if (formData.userType === 'candidate') {
        const { error: candidateError } = await supabase.from('candidates').insert({
          id: profileData?.id,
          profile_id: profileData?.id,
        });

        if (candidateError) throw candidateError;
      }

      if (formData.userType === 'company') {
        const { error: companyError } = await supabase.from('companies').insert({
          id: data.user?.id,
          name: formData.companyName,
        });

        if (companyError) throw companyError;
      }

      if (data) {
        setRegisteredEmail(formData.email);
        setShowEmailModal(true);

        const responseCreateContact = await fetch(`https://api.brevo.com/v3/contacts`, {
          method: 'POST',
          headers: {
            'api-key': import.meta.env.VITE_BREVO_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            attributes: {
              FNAME: formData.fullName,
              LNAME: "",
            },
            ext_id: data.user?.id,
          }),
        });

        const responseAddContactToList = await fetch(`https://api.brevo.com/v3/contacts/lists/${brevoIdListByUserType[formData.userType]}/contacts/add`, {
          method: 'POST',
          headers: {
            'api-key': import.meta.env.VITE_BREVO_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ emails: [formData.email] }),
        });
      }
    } catch (error: unknown) {
      toast({
        title: "Erro no cadastro",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Gradient Section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] p-12 text-white flex-col justify-center">
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
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-[#8B5CF6] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para home
            </Link>
          </div>
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl md:text-3xl text-center">Criar conta</CardTitle>
            <CardDescription className="text-center">
              Cadastre-se para encontrar as melhores oportunidades em dados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userType">Tipo de conta</Label>
                <Select
                  value={formData.userType}
                  onValueChange={(value) => setFormData({ ...formData, userType: value })}
                >
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
                <Label htmlFor="fullName">
                  {formData.userType === 'company' ? 'Nome do Responsável' : 'Nome completo'}
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder={formData.userType === 'company' ? 'Nome do responsável' : 'Seu nome completo'}
                  className="bg-white"
                  required
                />
              </div>

              {formData.userType === 'company' && (
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nome da Empresa</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Nome da empresa"
                    className="bg-white"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  className="bg-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="bg-white"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED]"
                disabled={loading}
              >
                {loading ? "Cadastrando..." : "Cadastrar"}
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

      <AlertDialog open={showEmailModal} onOpenChange={() => {}}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-primary" />
              </div>
            </div>
            <AlertDialogTitle className="text-xl">📧 Verifique seu Email!</AlertDialogTitle>
            <AlertDialogDescription className="text-left space-y-3">
              <p>Enviamos um email de confirmação para:</p>
              <div className="bg-muted p-3 rounded-lg text-center">
                <strong className="text-primary">{registeredEmail}</strong>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Para completar seu cadastro:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Acesse sua caixa de entrada</li>
                  <li>Procure o email do Data Hire Club</li>
                  <li>Clique no link de confirmação</li>
                </ol>
              </div>
              <p className="text-sm text-muted-foreground">
                💡 <strong>Dica:</strong> Se não encontrar o email, verifique a pasta de spam
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction 
            onClick={() => {
              setShowEmailModal(false);
              navigate("/login");
            }}
            className="w-full"
          >
            Entendi, vou verificar meu email
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}