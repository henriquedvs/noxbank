
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
  Smartphone
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Cards = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'physical' | 'virtual'>('physical');

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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="p-5 bg-white border-b border-gray-100 flex items-center">
        <Button 
          className="p-2 rounded-full bg-gray-100 mr-3"
          variant="ghost"
          size="icon"
          onClick={() => navigate('/home')}
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Button>
        <h1 className="text-xl font-semibold text-gray-800">Meus Cartões</h1>
      </header>

      <div className="p-5">
        <Tabs 
          defaultValue="physical" 
          className="w-full"
          onValueChange={(value) => setActiveTab(value as 'physical' | 'virtual')}
        >
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
            <TabsTrigger value="physical" className="data-[state=active]:bg-white">
              <CardIcon className="h-4 w-4 mr-2" />
              Físico
            </TabsTrigger>
            <TabsTrigger value="virtual" className="data-[state=active]:bg-white">
              <Smartphone className="h-4 w-4 mr-2" />
              Virtual
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="physical" className="space-y-6">
            {/* Card Visualization */}
            <div className="relative w-full h-56 rounded-2xl p-6 overflow-hidden bg-gradient-to-br from-green-400 to-green-500 shadow-lg">
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
                      <circle cx="7.5" cy="13.5" r="2.5" fill="white"/>
                      <circle cx="16.5" cy="13.5" r="2.5" fill="white" fillOpacity="0.8"/>
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
            <Card className="bg-white border-gray-100 shadow-sm">
              <CardContent className="p-5 space-y-5">
                <div className="flex items-center mb-2">
                  <CardIcon className="h-5 w-5 mr-2 text-nox-primary" />
                  <h3 className="text-lg font-medium text-gray-800">Detalhes do cartão</h3>
                </div>
                
                {showCardDetails ? (
                  <div className="grid grid-cols-2 gap-4 animate-in fade-in">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Número</p>
                      <div className="flex items-center">
                        <p className="text-gray-800 font-medium">4512 3456 7890 1234</p>
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
                      <p className="text-xs text-gray-500 mb-1">Validade</p>
                      <p className="text-gray-800 font-medium">12/28</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">CVV</p>
                      <div className="flex items-center">
                        <p className="text-gray-800 font-medium">123</p>
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
                      <p className="text-xs text-gray-500 mb-1">Nome</p>
                      <p className="text-gray-800 font-medium">JOÃO M SILVA</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Final</p>
                      <p className="text-gray-800 font-medium">1234</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Limite</p>
                      <p className="text-gray-800 font-medium">R$ 8.500,00</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Usado</p>
                      <p className="text-gray-800 font-medium">R$ 3.215,25</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <p className="text-emerald-500 font-medium">Ativo</p>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3 pt-3 mt-3 border-t border-gray-100">
                  <Button 
                    variant="outline" 
                    className="border-gray-200 text-gray-700 hover:text-gray-900"
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
            <Card className="bg-white border-gray-100 shadow-sm">
              <CardContent className="p-5 space-y-5">
                <div className="flex items-center mb-2">
                  <Shield className="h-5 w-5 mr-2 text-nox-primary" />
                  <h3 className="text-lg font-medium text-gray-800">Limites e segurança</h3>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-gray-800">Limite de compras</p>
                    <p className="text-gray-800 font-medium">R$ 8.500,00</p>
                  </div>
                  <Progress value={38} className="h-2 bg-gray-100" />
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-gray-500">Utilizado: R$ 3.215,25</p>
                    <p className="text-xs text-gray-500">Disponível: R$ 5.284,75</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-nox-primary/10 flex items-center justify-center mr-3">
                      <Shield className="h-5 w-5 text-nox-primary" />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">Segurança do cartão</p>
                      <p className="text-xs text-gray-500">Configurações e alertas</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="virtual" className="space-y-6">
            {/* No virtual cards yet */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 text-center shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="h-20 w-20 rounded-full bg-nox-primary/10 flex items-center justify-center">
                  <Smartphone className="h-10 w-10 text-nox-primary" />
                </div>
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Sem cartões virtuais</h3>
              <p className="text-gray-600 mb-6">
                Crie um cartão virtual para suas compras online e tenha mais segurança
              </p>
              <Button
                className="w-full bg-nox-primary py-6 rounded-xl"
                onClick={handleCreateVirtualCard}
              >
                <Plus className="h-5 w-5 mr-2" />
                Criar cartão virtual
              </Button>
            </div>
            
            {/* Virtual card benefits */}
            <Card className="bg-white border-gray-100 shadow-sm">
              <CardContent className="p-5 space-y-5">
                <h3 className="text-lg font-medium text-gray-800">Vantagens do cartão virtual</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-nox-primary/10 flex items-center justify-center mr-3 mt-1">
                      <Shield className="h-4 w-4 text-nox-primary" />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">Segurança extra</p>
                      <p className="text-sm text-gray-600">
                        Dados separados do seu cartão físico
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-nox-primary/10 flex items-center justify-center mr-3 mt-1">
                      <svg className="h-4 w-4 text-nox-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">Criação instantânea</p>
                      <p className="text-sm text-gray-600">
                        Use imediatamente após a criação
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-nox-primary/10 flex items-center justify-center mr-3 mt-1">
                      <svg className="h-4 w-4 text-nox-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 14L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 8H15V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">Controle total</p>
                      <p className="text-sm text-gray-600">
                        Limite e duração personalizados
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNav activeTab="cards" />
    </div>
  );
};

export default Cards;
