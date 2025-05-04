
import { useState } from "react";
import { ArrowLeft, Copy, QrCode, User, DollarSign, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/bottom-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Pix = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<"receive" | "send">("receive");
  const [amount, setAmount] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<"key" | "amount" | "confirm" | "success">("key");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { toast } = useToast(); // Extracting toast function from useToast hook

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format as currency
    const value = e.target.value.replace(/\D/g, "");
    const formattedValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(parseFloat(value) / 100 || 0);
    
    setAmount(formattedValue);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copiado!",
          description: "Informação copiada para a área de transferência.",
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

  const handlePixKeySearch = async () => {
    if (!pixKey) {
      toast({
        title: "Chave inválida",
        description: "Por favor, insira uma chave Pix válida",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // Remove @ from beginning if present
      const searchKey = pixKey.startsWith('@') ? pixKey.substring(1) : pixKey;
      
      console.log("Searching for user with key:", searchKey);
      
      // Search for exact username match first (case insensitive)
      const { data: exactData, error: exactError } = await supabase
        .from('profiles')
        .select('*')
        .ilike('username', searchKey)
        .limit(10);

      if (exactError) {
        throw exactError;
      }

      if (!exactData || exactData.length === 0) {
        // If no exact match, try a broader search
        const { data: fuzzyData, error: fuzzyError } = await supabase
          .from('profiles')
          .select('*')
          .ilike('username', `%${searchKey}%`)
          .limit(10);
          
        if (fuzzyError) {
          throw fuzzyError;
        }
        
        if (!fuzzyData || fuzzyData.length === 0) {
          toast({
            title: "Usuário não encontrado",
            description: "Nenhum usuário encontrado com esta chave Pix",
            variant: "destructive",
          });
          setIsProcessing(false);
          return;
        }
        
        // Use fuzzy search results
        const filteredData = fuzzyData.filter(u => u.id !== user?.id);
        
        if (filteredData.length === 0) {
          toast({
            title: "Operação inválida",
            description: "Você não pode enviar um Pix para si mesmo",
            variant: "destructive",
          });
          setIsProcessing(false);
          return;
        }
        
        setSelectedUser(filteredData[0]);
        setStep("amount");
        setIsProcessing(false);
        return;
      }

      // Verify if any of the found users is the user themselves
      const filteredData = exactData.filter(u => u.id !== user?.id);
      
      if (filteredData.length === 0) {
        toast({
          title: "Operação inválida",
          description: "Você não pode enviar um Pix para si mesmo",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }
      
      // Select the most relevant user (exact match first)
      const exactMatch = filteredData.find(u => u.username.toLowerCase() === searchKey.toLowerCase());
      setSelectedUser(exactMatch || filteredData[0]);
      setStep("amount");
    } catch (error: any) {
      console.error('Error searching for Pix key:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao buscar a chave Pix: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAmountSubmit = () => {
    const parsedAmount = parseFloat(amount.replace(/[^\d,]/g, "").replace(",", "."));
    
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor válido",
        variant: "destructive",
      });
      return;
    }
    
    if (profile && parsedAmount > Number(profile.account_balance)) {
      toast({
        title: "Saldo insuficiente",
        description: "Você não possui saldo suficiente para esta transferência",
        variant: "destructive",
      });
      return;
    }
    
    setStep("confirm");
  };

  const handleConfirmPix = async () => {
    if (!user || !selectedUser) return;
    
    setIsProcessing(true);
    
    try {
      const parsedAmount = parseFloat(amount.replace(/[^\d,]/g, "").replace(",", "."));
      
      // Call the transaction processing function via RPC
      const { data, error } = await supabase.rpc(
        'process_transaction',
        {
          sender_id: user.id,
          receiver_id: selectedUser.id,
          amount: parsedAmount,
          transaction_type: 'pix',
          description: `Pix para ${selectedUser.username}`
        }
      );

      if (error) {
        throw error;
      }

      // Refresh user profile to update balance
      await refreshProfile();
      
      // Mostrar toast de sucesso
      toast({
        title: "Pix enviado",
        description: `Você enviou ${amount} para ${selectedUser.username}`,
      });
      
      setStep("success");
    } catch (error: any) {
      console.error('Error processing Pix:', error);
      
      toast({
        title: "Erro no Pix",
        description: error.message || "Ocorreu um erro ao processar seu Pix",
        variant: "destructive",
      });
      
      setIsProcessing(false);
    }
  };

  const renderSendContent = () => {
    switch (step) {
      case "key":
        return (
          <div className="space-y-6">
            <div className="bg-nox-card p-5 rounded-xl">
              <h3 className="text-lg font-medium text-white mb-4">Digite a chave Pix</h3>
              
              <div className="space-y-4">
                <Input
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  placeholder="@username"
                  className="bg-nox-background text-white border-zinc-700"
                />
                
                <Button
                  onClick={handlePixKeySearch}
                  className="w-full bg-nox-primary hover:bg-nox-primary/90 text-white"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Buscando..." : "Continuar"}
                </Button>
              </div>
            </div>
            
            <div className="bg-nox-card p-5 rounded-xl">
              <h3 className="text-lg font-medium text-white mb-4">Chaves Pix recentes</h3>
              
              <p className="text-nox-textSecondary">
                Suas chaves Pix recentes aparecerão aqui para facilitar transações futuras.
              </p>
            </div>
          </div>
        );
        
      case "amount":
        return (
          <div className="space-y-6">
            <div className="bg-nox-card p-5 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-nox-buttonInactive flex items-center justify-center mr-3">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">{selectedUser?.full_name}</p>
                  <p className="text-nox-textSecondary text-sm">{selectedUser?.username} • {selectedUser?.account_number}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-nox-textSecondary text-sm">Valor do Pix</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-nox-primary" />
                    <Input 
                      className="pl-10 text-xl py-6 bg-nox-background text-white border-zinc-700 focus:border-nox-primary"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="R$ 0,00"
                    />
                  </div>
                  {profile && (
                    <p className="text-sm text-nox-textSecondary text-right">
                      Saldo disponível: R$ {Number(profile.account_balance).toFixed(2).replace('.', ',')}
                    </p>
                  )}
                </div>
                
                <Button 
                  onClick={handleAmountSubmit}
                  className="w-full bg-nox-primary hover:bg-nox-primary/90 text-white"
                >
                  Continuar
                </Button>
              </div>
            </div>
          </div>
        );
        
      case "confirm":
        return (
          <div className="space-y-6">
            <div className="bg-nox-card p-5 rounded-xl space-y-4">
              <h3 className="text-lg font-medium text-white text-center">Confirmar Pix</h3>
              
              <div className="py-4 text-center">
                <p className="text-nox-textSecondary text-sm">Valor</p>
                <p className="text-white text-3xl font-bold mt-1">{amount}</p>
              </div>
              
              <div className="border-t border-zinc-800 pt-4">
                <div className="flex justify-between">
                  <p className="text-nox-textSecondary">Para</p>
                  <p className="text-white font-medium">
                    {selectedUser?.full_name}
                  </p>
                </div>
                
                <div className="flex justify-between mt-2">
                  <p className="text-nox-textSecondary">Chave Pix</p>
                  <p className="text-white">
                    {selectedUser?.username}
                  </p>
                </div>
                
                <div className="flex justify-between mt-2">
                  <p className="text-nox-textSecondary">Data</p>
                  <p className="text-white">{new Date().toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-nox-card p-4 rounded-xl">
              <p className="text-nox-textSecondary text-sm">
                Ao confirmar, você concorda com os nossos termos e condições para transações Pix.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                className="flex-1 py-6 border-nox-textSecondary bg-transparent text-white hover:bg-nox-card"
                onClick={() => setStep("amount")}
                disabled={isProcessing}
              >
                Voltar
              </Button>
              <Button 
                className="flex-1 py-6 bg-nox-primary hover:bg-nox-primary/90 text-white"
                onClick={handleConfirmPix}
                disabled={isProcessing}
              >
                {isProcessing ? "Processando..." : "Confirmar"}
              </Button>
            </div>
          </div>
        );
        
      case "success":
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
            <div className="h-24 w-24 rounded-full bg-nox-primary/20 flex items-center justify-center mb-6 animate-pulse">
              <QrCode className="h-12 w-12 text-nox-primary" />
            </div>
            
            <h2 className="text-2xl font-bold text-white">Pix enviado!</h2>
            <p className="text-nox-textSecondary text-center">
              Seu Pix foi processado com sucesso e o dinheiro foi transferido imediatamente.
            </p>
            
            <div className="bg-nox-card p-4 rounded-xl w-full">
              <div className="flex justify-between mb-2">
                <p className="text-nox-textSecondary">Valor enviado</p>
                <p className="text-white font-medium">{amount}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-nox-textSecondary">Para</p>
                <p className="text-white">
                  {selectedUser?.full_name}
                </p>
              </div>
            </div>
            
            <Button 
              className="w-full py-6 bg-nox-primary hover:bg-nox-primary/90 text-white"
              onClick={() => navigate('/home')}
            >
              Voltar ao início
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-nox-background pb-20">
      {/* Header */}
      <header className="p-5">
        <div className="flex items-center">
          <button 
            className="p-2 rounded-full bg-nox-card mr-3"
            onClick={() => {
              if (activeTab === "send" && step !== "key") {
                if (step === "success") {
                  navigate('/home');
                } else {
                  setStep("key");
                }
              } else {
                navigate('/home');
              }
            }}
          >
            <ArrowLeft className="h-5 w-5 text-nox-textSecondary" />
          </button>
          <h1 className="text-xl font-semibold text-white">
            {activeTab === "send" && step === "success" ? "Pix enviado" : "Pix"}
          </h1>
        </div>
      </header>
      
      <div className="px-5">
        <Tabs 
          defaultValue="receive" 
          value={activeTab} 
          onValueChange={(value) => {
            setActiveTab(value as "receive" | "send");
            setStep("key");
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 bg-nox-card mb-6">
            <TabsTrigger value="receive">Receber</TabsTrigger>
            <TabsTrigger value="send">Enviar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="receive" className="space-y-6">
            <div className="bg-nox-card p-5 rounded-xl space-y-6">
              <h3 className="text-lg font-medium text-white mb-4">Chave Pix</h3>
              
              <div className="bg-nox-background p-4 rounded-lg flex items-center justify-between">
                <p className="text-white">{profile?.username}</p>
                <button 
                  className="p-2 rounded-full hover:bg-nox-card"
                  onClick={() => profile && copyToClipboard(profile.username)}
                >
                  <Copy className="h-4 w-4 text-nox-textSecondary" />
                </button>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full border border-zinc-700 text-white"
                onClick={() => profile && copyToClipboard(profile.username)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar chave
              </Button>
            </div>
            
            <div className="bg-nox-card p-5 rounded-xl space-y-6">
              <h3 className="text-lg font-medium text-white mb-4">QR Code</h3>
              
              <div className="flex justify-center">
                <div className="h-48 w-48 rounded-lg bg-white p-2">
                  <div className="h-full w-full flex items-center justify-center border-4 border-dashed border-gray-200">
                    <QrCode className="h-20 w-20 text-zinc-800" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="border border-zinc-700 text-white"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
                
                <Button 
                  className="bg-nox-primary hover:bg-nox-primary/90 text-white"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar código
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="send">
            {renderSendContent()}
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNav activeTab="home" />
    </div>
  );
};

export default Pix;
