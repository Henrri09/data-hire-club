import { CreatePost } from "@/components/community/CreatePost"
import { PostCard } from "@/components/community/PostCard"
import { CandidateHeader } from "@/components/candidate/Header"
import { CandidateSidebar } from "@/components/candidate/Sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

export default function Questions() {
  const isMobile = useIsMobile();
  
  // Dados mockados para exemplo
  const posts = [
    {
      author: {
        name: "Lucas Oliveira",
        date: "Há 3 horas",
      },
      content: "Alguém pode me ajudar com pandas? Estou tentando fazer um merge de dois dataframes mas está dando erro de chaves duplicadas. Como resolver?",
      likes: 5,
      comments: 8,
    },
    {
      author: {
        name: "Julia Mendes",
        date: "Há 2 dias",
      },
      content: "Qual a melhor forma de visualizar dados temporais? Estou em dúvida entre usar um line chart ou um area chart para mostrar tendências ao longo do tempo.",
      likes: 12,
      comments: 6,
    }
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <CandidateHeader />
      <div className="flex flex-1">
        {!isMobile && <CandidateSidebar />}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Tire suas dúvidas</h1>
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