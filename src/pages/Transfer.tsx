
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, ArrowUp, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BottomNav from "@/components/bottom-nav";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Transfer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, profile, refreshProfile } = useAuth();
  const [step, setStep] = useState<"initial" | "amount" | "confirm" | "success">("initial");
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
  
  // Navigate to user search page
  const goToUserSearch = () => {
    navigate("/search-users?destination=/transfer");
  };
  
  // Process transfer
  const handleProcessTransfer = async () => {
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
          transaction_type: 'transfer',
          description: `Transferência para ${selectedUser.full_name}`
        }
      );
      
      if (error) {
        throw error;
      }
      
      // Refresh user profile to get updated balance
      await refreshProfile();
      
      // Success!
      toast({
        title: "Transferência realizada",
        description: `Você enviou ${amount} para ${selectedUser.full_name} com sucesso!`
      });
      
      setStep("success");
      
    } catch (error: any) {
      console.error("Transfer error:", error);
      toast({
        title: "Erro na transferência",
        description: error.message || "Ocorreu um erro ao processar a transferência.",
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
  
  const renderContent = () => {
    switch (step) {
      case "initial":
        return (
          <div className="space-y-6">
            {/* Search User */}
            <div 
              className="bg-nox-card p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-zinc-900/50 border border-zinc-800"
              onClick={goToUserSearch}
            >
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-nox-primary/20 flex items-center justify-center mr-3">
                  <Search className="h-6 w-6 text-nox-primary" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Buscar usuário</h4>
                  <p className="text-sm text-nox-textSecondary">Pesquise por @username</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-nox-textSecondary">
                <ArrowUp className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Recent Contacts (Placeholder) */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Contatos recentes</h3>
              
              <p className="text-nox-textSecondary text-center py-6">
                Seus contatos recentes aparecerão aqui
              </p>
            </div>
          </div>
        );
        
      case "amount":
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
              <label className="text-nox-textSecondary text-sm">Valor da transferência</label>
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
        
      case "confirm":
        return (
          <div className="space-y-6">
            <div className="bg-nox-card p-5 rounded-xl space-y-4">
              <h3 className="text-lg font-medium text-white text-center">Confirmar transferência</h3>
              
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
                onClick={handleProcessTransfer}
                disabled={isProcessing}
              >
                {isProcessing ? "Processando..." : "Confirmar transferência"}
              </Button>
            </div>
          </div>
        );
        
      case "success":
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
            <div className="h-24 w-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-white">Transferência concluída!</h2>
            <p className="text-nox-textSecondary text-center">
              Sua transferência foi processada com sucesso e o dinheiro foi enviado imediatamente.
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
              onClick={() => {
                if (step === "initial") navigate('/home');
                else setStep("initial");
              }}
            >
              <ArrowLeft className="h-5 w-5 text-nox-textSecondary" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-white">
                {step === "initial" ? "Transferência" :
                 step === "amount" ? "Valor da transferência" :
                 step === "confirm" ? "Confirmar transferência" :
                 "Transferência concluída"}
              </h1>
              {step === "initial" && <p className="text-nox-textSecondary mt-1">Envie dinheiro</p>}
            </div>
          </div>
        </div>
      </header>
      
      <div className="p-5 space-y-6">
        {renderContent()}
      </div>
      
      <BottomNav activeTab="home" />
    </div>
  );
};

export default Transfer;
