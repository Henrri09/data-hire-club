import { Button } from "@/components/ui/button"

interface IntroductionsHeaderProps {
  isAdmin: boolean
}

export function IntroductionsHeader({ isAdmin }: IntroductionsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">Apresente-se à Comunidade</h1>
    </div>
  )
}