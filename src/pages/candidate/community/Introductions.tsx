import { CreatePost } from "@/components/community/CreatePost"
import { PostCard } from "@/components/community/PostCard"
import { CandidateHeader } from "@/components/candidate/Header"
import { CandidateSidebar } from "@/components/candidate/Sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

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

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <CandidateHeader />
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