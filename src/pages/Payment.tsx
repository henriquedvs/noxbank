
import { useState, useEffect } from "react";
import { Barcode, Camera, Search, Lock, Calendar, ArrowDown, ArrowUp, CheckCircle, User, ArrowLeft } from "lucide-react";
import BottomNav from "@/components/bottom-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import AccountDisplay from "@/components/account-display";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Payment = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, refreshProfile } = useAuth();
  const [step, setStep] = useState<"initial" | "amount" | "confirm" | "success">("initial");
  
  // Barcode related states
  const [barcodeValue, setBarcodeValue] = useState("");
  const [billDetails, setBillDetails] = useState<{
    recipient: string;
    value: string;
    dueDate: string;
    barcode: string;
  } | null>(null);
  
  // User payment related states
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle user selection from search page
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const selectedUserParam = searchParams.get('selectedUser');
    
    if (selectedUserParam) {
      try {
        const user = JSON.parse(decodeURIComponent(selectedUserParam));
        setSelectedUser(user);
        setStep("amount");
      } catch (error) {
        console.error("Error parsing selected user:", error);
      }
    }
  }, [location]);
  
  // Handler for scanning barcode
  const handleScanBarcode = () => {
    toast({
      title: "Câmera iniciada",
      description: "Esta funcionalidade usaria a câmera do dispositivo para escanear o código de barras."
    });
  };
  
  // Validate barcode and load bill details
  const validateBarcode = () => {
    if (!barcodeValue || barcodeValue.length < 10) {
      toast({
        title: "Código inválido",
        description: "Por favor, insira um código de barras válido.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Código validado!",
      description: "Detalhes do boleto carregados."
    });
    
    // Simulate loading bill details
    setTimeout(() => {
      setBillDetails({
        recipient: "Empresa de Energia XPTO",
        value: "R$ 127,35",
        dueDate: "25/05/2025",
        barcode: barcodeValue
      });
    }, 1000);
  };

  // Navigate to user search page
  const goToUserSearch = () => {
    navigate("/search-users?destination=/payment");
  };
  
  // Format amount as currency
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
  
  // Process payment
  const handleProcessPayment = async () => {
    if (!amount || !selectedUser || !user) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os dados necessários.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Parse amount value (remove currency formatting)
      const parsedAmount = parseFloat(amount.replace(/[^\d,]/g, "").replace(",", "."));
      
      if (parsedAmount <= 0) {
        throw new Error("O valor deve ser maior que zero");
      }
      
      if (profile && parsedAmount > Number(profile.account_balance)) {
        throw new Error("Saldo insuficiente para esta transferência");
      }
      
      // Process transaction using the database function
      const { data, error } = await supabase.rpc(
        'process_transaction',
        {
          sender_id: user.id,
          receiver_id: selectedUser.id,
          amount: parsedAmount,
          transaction_type: 'payment',
          description: `Pagamento para ${selectedUser.full_name}`
        }
      );
      
      if (error) {
        throw error;
      }
      
      // Refresh user profile to get updated balance
      await refreshProfile();
      
      // Success!
      toast({
        title: "Pagamento realizado",
        description: `Você enviou ${amount} para ${selectedUser.full_name} com sucesso!`
      });
      
      setStep("success");
      
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Erro no pagamento",
        description: error.message || "Ocorreu um erro ao processar o pagamento.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "??";
    
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };
  
  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copiado!",
          description: "Informação copiada para a área de transferência."
        });
      },
      (err) => {
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o texto.",
          variant: "destructive"
        });
      }
    );
  };
  
  // Render content based on current step
  const renderContent = () => {
    if (step === "initial") {
      return (
        <div className="space-y-6">
          {/* Barcode Payment */}
          <div className="nox-card border border-zinc-800">
            <h3 className="text-lg font-medium text-white mb-4">Código de barras</h3>
            
            <div className="space-y-4">
              <div className="flex">
                <Input
                  value={barcodeValue}
                  onChange={(e) => setBarcodeValue(e.target.value)}
                  placeholder="Digite o código de barras"
                  className="flex-1 nox-input bg-nox-background text-white border-zinc-700"
                />
                <Button
                  onClick={handleScanBarcode}
                  variant="outline"
                  className="ml-2 border-zinc-700"
                >
                  <Camera className="h-5 w-5" />
                </Button>
              </div>
              
              <Button 
                onClick={validateBarcode} 
                className="w-full nox-button-primary"
                disabled={!barcodeValue}
              >
                Validar código
              </Button>
            </div>
          </div>
          
          {/* User Payment */}
          <div 
            className="nox-card border border-zinc-800 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-zinc-900/50"
            onClick={goToUserSearch}
          >
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-nox-primary/20 flex items-center justify-center mr-3">
                <Search className="h-6 w-6 text-nox-primary" />
              </div>
              <div>
                <h4 className="text-white font-medium">Pagar para usuário</h4>
                <p className="text-sm text-nox-textSecondary">Busque por @username</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-nox-textSecondary"
            >
              <ArrowDown className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Bill Details */}
          {billDetails && (
            <div className="nox-card border border-zinc-800">
              <h3 className="text-lg font-medium text-white mb-4">Detalhes do boleto</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-nox-textSecondary">Beneficiário</span>
                  <span className="text-white font-medium">{billDetails.recipient}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-nox-textSecondary">Valor</span>
                  <span className="text-white font-medium">{billDetails.value}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-nox-textSecondary">Vencimento</span>
                  <span className="text-white font-medium">{billDetails.dueDate}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button className="w-full nox-button-primary">
                  <Lock className="h-4 w-4 mr-2" />
                  Pagar agora
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-zinc-700 text-white hover:bg-zinc-800"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar pagamento
                </Button>
              </div>
            </div>
          )}
          
          {/* Recent Payments */}
          <div className="nox-card border border-zinc-800">
            <h3 className="text-lg font-medium text-white mb-4">Pagamentos recentes</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-white">Conta de Luz</h4>
                  <p className="text-sm text-nox-textSecondary">10/04/2025</p>
                </div>
                <p className="text-red-500">R$ 142,55</p>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-white">Conta de Água</h4>
                  <p className="text-sm text-nox-textSecondary">05/04/2025</p>
                </div>
                <p className="text-red-500">R$ 87,90</p>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-white">Internet</h4>
                  <p className="text-sm text-nox-textSecondary">01/04/2025</p>
                </div>
                <p className="text-red-500">R$ 99,99</p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              className="w-full mt-4 text-nox-primary hover:bg-nox-primary/10"
            >
              Ver histórico completo
            </Button>
          </div>
        </div>
      );
    }
    
    if (step === "amount") {
      return (
        <div className="space-y-6">
          <div className="bg-nox-card p-4 rounded-xl mb-4">
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-3">
                {selectedUser?.avatar_url ? (
                  <AvatarImage src={selectedUser.avatar_url} alt={selectedUser.full_name} />
                ) : (
                  <AvatarFallback className="bg-nox-buttonInactive text-white">
                    {selectedUser ? getInitials(selectedUser.full_name) : 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="text-white font-medium">{selectedUser?.full_name}</p>
                <p className="text-nox-textSecondary text-sm">@{selectedUser?.username}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-nox-textSecondary text-sm">Valor do pagamento</label>
            <div className="relative">
              <Input 
                className="text-xl py-6 bg-nox-card text-white border-zinc-700 text-center"
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
          
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              className="flex-1 border-zinc-700"
              onClick={() => setStep("initial")}
            >
              Voltar
            </Button>
            
            <Button 
              className="flex-1 bg-nox-primary"
              onClick={() => setStep("confirm")}
              disabled={!amount}
            >
              Continuar
            </Button>
          </div>
        </div>
      );
    }
    
    if (step === "confirm") {
      return (
        <div className="space-y-6">
          <div className="bg-nox-card p-5 rounded-xl space-y-4">
            <h3 className="text-lg font-medium text-white text-center">Confirmar pagamento</h3>
            
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
                <p className="text-nox-textSecondary">Usuário</p>
                <p className="text-white">
                  @{selectedUser?.username}
                </p>
              </div>
              
              <div className="flex justify-between mt-2">
                <p className="text-nox-textSecondary">Data</p>
                <p className="text-white">{new Date().toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              className="flex-1 border-zinc-700"
              onClick={() => setStep("amount")}
              disabled={isProcessing}
            >
              Voltar
            </Button>
            
            <Button 
              className="flex-1 bg-nox-primary"
              onClick={handleProcessPayment}
              disabled={isProcessing}
            >
              {isProcessing ? "Processando..." : "Confirmar pagamento"}
            </Button>
          </div>
        </div>
      );
    }
    
    if (step === "success") {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
          <div className="h-24 w-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6 animate-bounce">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-white">Pagamento realizado!</h2>
          <p className="text-nox-textSecondary text-center">
            Seu pagamento foi processado com sucesso e o dinheiro foi transferido imediatamente.
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
            <div className="flex justify-between">
              <p className="text-nox-textSecondary">Usuário</p>
              <p className="text-white">
                @{selectedUser?.username}
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
    
    return null;
  };
  
  return (
    <div className="min-h-screen bg-nox-background pb-20">
      {/* Header */}
      <header className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              className="p-2 rounded-full bg-nox-card mr-3"
              variant="ghost"
              size="icon"
              onClick={() => step === "initial" ? navigate('/home') : setStep("initial")}
            >
              <ArrowLeft className="h-5 w-5 text-nox-textSecondary" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-white">
                {step === "amount" ? "Valor do pagamento" : 
                step === "confirm" ? "Confirmar pagamento" : 
                step === "success" ? "Pagamento concluído" : "Pagamento"}
              </h1>
              {step === "initial" && <p className="text-nox-textSecondary mt-1">Contas e boletos</p>}
            </div>
          </div>
          
          {step !== "initial" && step !== "success" && (
            <Button
              variant="ghost"
              size="icon"
              className="text-nox-textSecondary"
              onClick={() => {
                if (step === "amount") setStep("initial");
                if (step === "confirm") setStep("amount");
              }}
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          )}
        </div>
      </header>
      
      <div className="p-5 space-y-6">
        {renderContent()}
      </div>
      
      <BottomNav activeTab="home" />
    </div>
  );
};

export default Payment;
