import { CreatePost } from "@/components/community/CreatePost"
import { PostCard } from "@/components/community/PostCard"
import { CandidateHeader } from "@/components/candidate/Header"
import { CandidateSidebar } from "@/components/candidate/Sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

export default function Learning() {
  const isMobile = useIsMobile();
  
  // Dados mockados para exemplo
  const posts = [
    {
      author: {
        name: "Pedro Costa",
        date: "Há 1 dia",
      },
      content: "Estou fazendo um curso intensivo de Machine Learning na Coursera. Já aprendi sobre regressão linear e logística. Alguém mais está estudando ML?",
      likes: 15,
      comments: 7,
    },
    {
      author: {
        name: "Marina Santos",
        date: "Há 4 dias",
      },
      content: "Comecei a estudar SQL avançado e estou impressionada com o poder das window functions! Recomendo muito o curso da DataCamp sobre isso.",
      likes: 10,
      comments: 4,
    }
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <CandidateHeader />
      <div className="flex flex-1">
        {!isMobile && <CandidateSidebar />}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">O que você está aprendendo?</h1>
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