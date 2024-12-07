import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
}

export function SearchBar({ value, onChange, onSearch }: SearchBarProps) {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar posts..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          className="pl-10"
        />
      </div>
    </div>
  )
}