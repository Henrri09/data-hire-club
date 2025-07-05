import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Users, BookOpen, MessageSquare, Trophy, Target, Zap, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function CandidatesLanding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = {
        full_name: formData.fullName,
        user_type: "candidate",
      };

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
        user_type: "candidate",
        email: formData.email,
      }).select('id').single();

      if (profileData?.id) {
        const { error: candidateError } = await supabase.from('candidates').insert({
          id: profileData.id,
          profile_id: profileData.id,
        });

        if (candidateError) throw candidateError;
      }

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu email para confirmar o cadastro.",
      });

      navigate("/login");
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Navigation */}
      <nav className="border-b bg-black text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/6e308181-180a-4c1e-90e4-1b3e51e6d1a5.png"
              alt="Hire Club" 
              className="h-24 w-auto"
            />
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm text-gray-300 hover:text-white">
              Já tem conta? Entre
            </Link>
            <Link to="/company/login">
              <Button variant="outline" size="sm">
                Sou Empresa
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Sua Carreira em{" "}
                <span className="text-primary">Dados</span>{" "}
                Começa Aqui
              </h1>
              <p className="text-xl text-muted-foreground">
                Junte-se <strong>GRATUITAMENTE</strong> à maior comunidade de profissionais de dados do Brasil
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">100% Gratuito</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Comunidade Ativa</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <Trophy className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Sistema de Gamificação</span>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <Card id="cadastro" className="bg-background/80 backdrop-blur-sm border-2 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Cadastre-se Grátis</CardTitle>
              <CardDescription className="text-center">
                Comece sua jornada em 30 segundos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome completo</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu@email.com"
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
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? "Cadastrando..." : "Cadastrar Grátis"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Ao se cadastrar, você concorda com nossos{" "}
                  <Link to="/termos" className="text-primary hover:underline">
                    Termos de Uso
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Por que Escolher o Data Hire Club?</h2>
            <p className="text-xl text-muted-foreground">
              Tudo que você precisa para acelerar sua carreira em dados
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gratuito para Sempre</h3>
              <p className="text-muted-foreground">
                Sem taxas ocultas, sem pegadinhas. Acesso completo à plataforma
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Comunidade Ativa</h3>
              <p className="text-muted-foreground">
                Conecte-se com analistas, cientistas e engenheiros de dados
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Vagas Exclusivas</h3>
              <p className="text-muted-foreground">
                Oportunidades curadas especialmente para profissionais de dados
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gamificação</h3>
              <p className="text-muted-foreground">
                Ganhe pontos e níveis por participação ativa na comunidade
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Funcionalidades da Comunidade</h2>
            <p className="text-xl text-muted-foreground">
              Conecte-se, aprenda e cresça com outros profissionais
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="w-12 h-12 mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Apresente-se à Comunidade</h3>
              <p className="text-muted-foreground mb-4">
                Compartilhe sua jornada profissional e conecte-se com outros membros da comunidade
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  Conte sua história profissional
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  Encontre profissionais similares
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  Expanda sua rede de contatos
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Acelere seu Aprendizado</h3>
              <p className="text-muted-foreground mb-4">
                Descubra cursos, livros e recursos compartilhados pela comunidade
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  Recursos curados por experts
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  Discussões sobre tendências
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  Compartilhe seus aprendizados
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 mb-4 bg-primary/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Tire suas Dúvidas</h3>
              <p className="text-muted-foreground mb-4">
                Receba ajuda de profissionais experientes em tempo real
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  Suporte da comunidade
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  Respostas rápidas
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  Sistema de busca avançado
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Como Funciona</h2>
            <p className="text-xl text-muted-foreground">
              Em 5 passos simples, você está pronto para acelerar sua carreira
            </p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { number: "1", title: "Cadastro Gratuito", desc: "30 segundos para criar sua conta" },
              { number: "2", title: "Complete seu Perfil", desc: "Adicione skills e experiência" },
              { number: "3", title: "Explore a Comunidade", desc: "Participe das discussões" },
              { number: "4", title: "Candidate-se a Vagas", desc: "Acesse oportunidades exclusivas" },
              { number: "5", title: "Ganhe Pontos", desc: "Por participação ativa" }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {step.number}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Pronto para Começar?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Cadastre-se gratuitamente e comece a acelerar sua carreira em dados hoje mesmo
            </p>
            <Button 
              size="lg" 
              className="text-lg px-8"
              onClick={() => {
                document.getElementById('cadastro')?.scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }}
            >
              Cadastrar Agora - É Grátis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Sem compromisso • Acesso completo • Para sempre gratuito
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <img 
              src="/lovable-uploads/6e308181-180a-4c1e-90e4-1b3e51e6d1a5.png" 
              alt="Hire Club" 
              className="h-20 w-auto mb-4 md:mb-0"
            />
            <div className="flex gap-6 text-sm">
              <Link to="/sobre" className="text-gray-300 hover:text-white">
                Sobre
              </Link>
              <Link to="/termos" className="text-gray-300 hover:text-white">
                Termos
              </Link>
              <Link to="/privacidade" className="text-gray-300 hover:text-white">
                Privacidade
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}