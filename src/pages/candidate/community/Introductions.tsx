import { CreatePost } from "@/components/community/CreatePost"
import { PostCard } from "@/components/community/PostCard"
import { CandidateSidebar } from "@/components/candidate/Sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "react-router-dom"

export default function Introductions() {
  const isMobile = useIsMobile();
  
  // Dados mockados para exemplo
  const posts = [
    {
      author: {
        name: "Ana Silva",
        date: "Há 2 dias",
      },
      content: "Olá! Sou analista de dados há 5 anos, especializada em visualização de dados e análise preditiva. Estou animada para fazer parte desta comunidade e compartilhar experiências!",
      likes: 12,
      comments: 3,
    },
    {
      author: {
        name: "Carlos Santos",
        date: "Há 3 dias",
      },
      content: "Oi pessoal! Estou começando minha jornada em ciência de dados. Atualmente estou estudando Python e estatística. Adoraria conectar com outros profissionais da área!",
      likes: 8,
      comments: 5,
    },
  ]

  // Simulando dados do usuário (substituir quando tivermos autenticação)
  const user = {
    name: "João Silva",
    photoUrl: null
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const SidebarContent = () => (
    <div className="h-full py-4">
      <CandidateSidebar />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full border-b bg-black text-white">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center">
            {isMobile ? (
              <>
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="mr-4">
                      <Menu className="h-6 w-6" />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-64 p-0">
                    <SidebarContent />
                  </SheetContent>
                </Sheet>
                <span className="font-bold">Data Hire Club</span>
              </>
            ) : (
              <Link to="/" className="mr-6 flex items-center space-x-2">
                <span className="font-bold">Data Hire Club</span>
              </Link>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.photoUrl || undefined} />
              <AvatarFallback className="bg-white/20 text-white">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {!isMobile && <CandidateSidebar />}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Apresente-se à Comunidade</h1>
            <CreatePost />
            <div className="space-y-4">
              {posts.map((post, index) => (
                <PostCard key={index} {...post} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}