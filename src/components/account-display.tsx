
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface AccountDisplayProps {
  label?: string;
  showCopyButton?: boolean;
  className?: string;
}

const AccountDisplay = ({ label = "Número da Conta", showCopyButton = true, className = "" }: AccountDisplayProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copiado!",
          description: "Número da conta copiado para a área de transferência.",
        });
      },
      (err) => {
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o texto.",
          variant: "destructive",
        });
      }
    );
  };
  
  if (!profile) return null;
  
  return (
    <div className={`bg-nox-card p-5 rounded-xl space-y-4 ${className}`}>
      <h3 className="text-lg font-medium text-white">{label}</h3>
      
      <div className="bg-nox-background p-4 rounded-lg flex items-center justify-between">
        <p className="text-white">{profile.account_number}</p>
        {showCopyButton && (
          <button 
            className="p-2 rounded-full hover:bg-nox-card"
            onClick={() => copyToClipboard(profile.account_number)}
          >
            <Copy className="h-4 w-4 text-nox-textSecondary" />
          </button>
        )}
      </div>
      
      {showCopyButton && (
        <Button 
          variant="outline" 
          className="w-full border border-zinc-700 text-white"
          onClick={() => copyToClipboard(profile.account_number)}
        >
          <Copy className="h-4 w-4 mr-2" />
          Copiar número da conta
        </Button>
      )}
      
      <p className="text-nox-textSecondary text-sm">
        Compartilhe este número para receber transferências e pagamentos.
      </p>
    </div>
  );
};

export default AccountDisplay;
