import { CreatePost } from "@/components/community/CreatePost"
import { PostCard } from "@/components/community/PostCard"

export default function Introductions() {
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
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Apresente-se à Comunidade</h1>
      <CreatePost />
      <div className="space-y-4">
        {posts.map((post, index) => (
          <PostCard key={index} {...post} />
        ))}
      </div>
    </div>
  )
}