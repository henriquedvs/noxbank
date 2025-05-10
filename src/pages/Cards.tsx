
import BottomNav from "@/components/bottom-nav";
import { useState } from "react";
import { 
  CreditCard as CardIcon, 
  Eye, 
  EyeOff, 
  Lock, 
  ChevronRight, 
  Plus, 
  ArrowLeft, 
  Shield, 
  Settings,
  AlertCircle,
  Smartphone
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Cards = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [activeTap, setActiveTab] = useState<'physical' | 'virtual'>('physical');

  // Handle card freeze/block
  const handleCardBlock = () => {
    toast({
      title: "Cartão bloqueado",
      description: "Seu cartão foi bloqueado temporariamente.",
      variant: "default"
    });
  };

  // Handle card settings
  const handleCardSettings = () => {
    toast({
      title: "Configurações do cartão",
      description: "Esta funcionalidade estará disponível em breve.",
    });
  };

  // Handle virtual card creation
  const handleCreateVirtualCard = () => {
    toast({
      title: "Criar cartão virtual",
      description: "Esta funcionalidade estará disponível em breve.",
    });
  };

  return (
    <div className="min-h-screen bg-nox-background pb-20">
      {/* Header */}
      <header className="p-5 flex items-center mb-2">
        <Button 
          className="p-2 rounded-full bg-nox-card mr-3"
          variant="ghost"
          size="icon"
          onClick={() => navigate('/home')}
        >
          <ArrowLeft className="h-5 w-5 text-nox-textSecondary" />
        </Button>
        <h1 className="text-xl font-semibold text-white">Meus Cartões</h1>
      </header>

      {/* Tabs Navigation */}
      <div className="px-5 mb-6">
        <div className="flex bg-nox-card rounded-lg p-1">
          <button 
            className={`flex-1 py-3 rounded-md transition-colors ${
              activeTap === 'physical' 
                ? 'bg-nox-primary text-white' 
                : 'text-nox-textSecondary'
            }`}
            onClick={() => setActiveTab('physical')}
          >
            <CardIcon className="h-4 w-4 mx-auto mb-1" />
            <span className="text-sm">Físico</span>
          </button>
          <button 
            className={`flex-1 py-3 rounded-md transition-colors ${
              activeTap === 'virtual' 
                ? 'bg-nox-primary text-white' 
                : 'text-nox-textSecondary'
            }`}
            onClick={() => setActiveTab('virtual')}
          >
            <Smartphone className="h-4 w-4 mx-auto mb-1" />
            <span className="text-sm">Virtual</span>
          </button>
        </div>
      </div>
      
      {activeTap === 'physical' ? (
        <div className="px-5 space-y-6">
          {/* Card Visualization */}
          <div className="relative w-full h-52 rounded-2xl p-5 overflow-hidden bg-gradient-to-br from-nox-primary/80 to-nox-primary shadow-lg">
            {/* Background pattern */}
            <div className="absolute inset-0 w-full h-full opacity-10">
              <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-black/10"></div>
              <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-black/10"></div>
            </div>
            
            <div className="relative h-full flex flex-col justify-between">
              {/* Card top section */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white/70 text-xs">NOX Bank</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xl font-bold text-white">
                      Mastercard
                    </span>
                  </div>
                </div>
                
                <div className="w-12 h-12">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 3.5C15 4.32843 14.3284 5 13.5 5C12.6716 5 12 4.32843 12 3.5C12 2.67157 12.6716 2 13.5 2C14.3284 2 15 2.67157 15 3.5Z" fill="white"/>
                    <path d="M15 12C15 12.8284 14.3284 13.5 13.5 13.5C12.6716 13.5 12 12.8284 12 12C12 11.1716 12.6716 10.5 13.5 10.5C14.3284 10.5 15 11.1716 15 12Z" fill="white"/>
                    <path d="M13.5 22C14.3284 22 15 21.3284 15 20.5C15 19.6716 14.3284 19 13.5 19C12.6716 19 12 19.6716 12 20.5C12 21.3284 12.6716 22 13.5 22Z" fill="white"/>
                    <path d="M6.5 22C7.32843 22 8 21.3284 8 20.5C8 19.6716 7.32843 19 6.5 19C5.67157 19 5 19.6716 5 20.5C5 21.3284 5.67157 22 6.5 22Z" fill="white"/>
                    <path d="M6.5 5C7.32843 5 8 4.32843 8 3.5C8 2.67157 7.32843 2 6.5 2C5.67157 2 5 2.67157 5 3.5C5 4.32843 5.67157 5 6.5 5Z" fill="white"/>
                  </svg>
                </div>
              </div>
              
              {/* Card bottom section */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm text-white font-medium">
                    {showCardDetails ? '4512 3456 7890 1234' : '•••• •••• •••• 1234'}
                  </p>
                  <button 
                    onClick={() => setShowCardDetails(!showCardDetails)} 
                    className="ml-2 p-1 bg-white/10 rounded-full"
                  >
                    {showCardDetails ? (
                      <EyeOff className="h-4 w-4 text-white" />
                    ) : (
                      <Eye className="h-4 w-4 text-white" />
                    )}
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-white font-medium">JOÃO M SILVA</p>
                  <p className="text-white/70">12/28</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Card Details */}
          <Card className="bg-nox-card border-zinc-800 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <CardIcon className="h-5 w-5 mr-2 text-nox-primary" />
                Detalhes do cartão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {showCardDetails ? (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in">
                  <div>
                    <p className="text-xs text-nox-textSecondary mb-1">Número</p>
                    <div className="flex items-center">
                      <p className="text-white font-medium">4512 3456 7890 1234</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-2 h-6 text-nox-primary p-0"
                        onClick={() => {
                          navigator.clipboard.writeText("4512 3456 7890 1234");
                          toast({ title: "Número copiado" });
                        }}
                      >
                        Copiar
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-nox-textSecondary mb-1">Validade</p>
                    <p className="text-white font-medium">12/28</p>
                  </div>
                  <div>
                    <p className="text-xs text-nox-textSecondary mb-1">CVV</p>
                    <div className="flex items-center">
                      <p className="text-white font-medium">123</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-2 h-6 text-nox-primary p-0"
                        onClick={() => {
                          navigator.clipboard.writeText("123");
                          toast({ title: "CVV copiado" });
                        }}
                      >
                        Copiar
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-nox-textSecondary mb-1">Nome</p>
                    <p className="text-white font-medium">JOÃO M SILVA</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-nox-textSecondary mb-1">Final</p>
                    <p className="text-white font-medium">1234</p>
                  </div>
                  <div>
                    <p className="text-xs text-nox-textSecondary mb-1">Limite</p>
                    <p className="text-white font-medium">R$ 8.500,00</p>
                  </div>
                  <div>
                    <p className="text-xs text-nox-textSecondary mb-1">Usado</p>
                    <p className="text-white font-medium">R$ 3.215,25</p>
                  </div>
                  <div>
                    <p className="text-xs text-nox-textSecondary mb-1">Status</p>
                    <p className="text-emerald-500 font-medium">Ativo</p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3 pt-3 mt-3 border-t border-zinc-800">
                <Button 
                  variant="outline" 
                  className="border-zinc-700 text-nox-textSecondary hover:text-white"
                  onClick={handleCardBlock}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Bloquear
                </Button>
                <Button 
                  variant="outline"
                  className="border-nox-primary text-nox-primary hover:bg-nox-primary/10"
                  onClick={handleCardSettings}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Limits and Security */}
          <Card className="bg-nox-card border-zinc-800 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Shield className="h-5 w-5 mr-2 text-nox-primary" />
                Limites e segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-white">Limite de compras</p>
                    <p className="text-white font-medium">R$ 8.500,00</p>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-nox-primary rounded-full" style={{ width: '38%' }}></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-nox-textSecondary">Utilizado: R$ 3.215,25</p>
                    <p className="text-xs text-nox-textSecondary">Disponível: R$ 5.284,75</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-zinc-800">
                  <div className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-lg hover:bg-zinc-800/50 transition-colors cursor-pointer">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-3 text-nox-primary" />
                      <div>
                        <p className="text-white">Notificações de segurança</p>
                        <p className="text-xs text-nox-textSecondary">Alertas de transações</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-nox-textSecondary" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Virtual cards tab
        <div className="px-5 space-y-6">
          {/* No virtual cards yet */}
          <div className="bg-nox-card border border-zinc-800 rounded-xl p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-nox-primary/10 flex items-center justify-center">
                <Smartphone className="h-8 w-8 text-nox-primary" />
              </div>
            </div>
            <h3 className="text-white text-lg font-medium mb-2">Sem cartões virtuais</h3>
            <p className="text-nox-textSecondary mb-6">
              Crie um cartão virtual para suas compras online e tenha mais segurança
            </p>
            <Button
              className="w-full bg-nox-primary"
              onClick={handleCreateVirtualCard}
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar cartão virtual
            </Button>
          </div>
          
          {/* Virtual card benefits */}
          <Card className="bg-nox-card border-zinc-800 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Vantagens do cartão virtual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-nox-primary/10 flex items-center justify-center mr-3 mt-1">
                  <Shield className="h-3.5 w-3.5 text-nox-primary" />
                </div>
                <div>
                  <p className="text-white font-medium">Segurança extra</p>
                  <p className="text-sm text-nox-textSecondary">
                    Dados separados do seu cartão físico
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-nox-primary/10 flex items-center justify-center mr-3 mt-1">
                  <svg className="h-3.5 w-3.5 text-nox-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Criação instantânea</p>
                  <p className="text-sm text-nox-textSecondary">
                    Use imediatamente após a criação
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-nox-primary/10 flex items-center justify-center mr-3 mt-1">
                  <svg className="h-3.5 w-3.5 text-nox-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 14L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 8H15V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Controle total</p>
                  <p className="text-sm text-nox-textSecondary">
                    Limite e duração personalizados
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <BottomNav activeTab="cards" />
    </div>
  );
};

export default Cards;
