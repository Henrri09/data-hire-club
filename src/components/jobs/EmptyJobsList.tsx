
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function EmptyJobsList() {
  return (
    <div className="text-center py-12 px-4">
      <div className="max-w-md mx-auto">
        <img 
          src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop&crop=center"
          alt="Monitor showing programming code"
          className="w-full max-w-xs mx-auto mb-8 rounded-lg shadow-lg"
        />
        
        <h3 className="text-2xl font-bold text-[#8B5CF6] mb-4">
          Nenhuma vaga encontrada
        </h3>
        
        <p className="text-[#8E9196] mb-6 leading-relaxed">
          Não encontramos vagas que correspondam aos seus critérios de busca. 
          Que tal tentar uma busca diferente ou verificar novamente em breve?
        </p>
        
        <div className="space-y-3">
          <Button 
            asChild 
            className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white px-6 py-2"
          >
            <Link to="/register">
              Cadastre-se para receber novas vagas
            </Link>
          </Button>
          
          <p className="text-sm text-[#8E9196]">
            Novas oportunidades são publicadas diariamente!
          </p>
        </div>
      </div>
    </div>
  );
}
