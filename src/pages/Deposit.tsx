
import { useState } from "react";
import { ArrowLeft, CreditCard, DollarSign, Landmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/bottom-nav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Deposit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, refreshProfile } = useAuth();
  
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<"amount" | "method" | "success">("amount");
  const [selectedMethod, setSelectedMethod] = useState<"card" | "bank">("card");
  
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
  
  const handleContinue = () => {
    const parsedAmount = parseFloat(amount.replace(/[^\d,]/g, "").replace(",", "."));
    
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor válido",
        variant: "destructive",
      });
      return;
    }
    
    setStep("method");
  };
  
  const handleDeposit = async () => {
    if (!user) return;
    
    setIsProcessing(true);
    
    try {
      const parsedAmount = parseFloat(amount.replace(/[^\d,]/g, "").replace(",", "."));
      
      // Call the transaction processing function via RPC (deposit is a self-transfer)
      const { data, error } = await supabase.rpc(
        'process_transaction',
        {
          sender_id: user.id,
          receiver_id: user.id, // Self-transfer for deposit
          amount: parsedAmount,
          transaction_type: 'deposit',
          description: `Depósito via ${selectedMethod === 'card' ? 'cartão' : 'transferência bancária'}`
        }
      );

      if (error) {
        throw error;
      }

      // Refresh user profile to update balance
      await refreshProfile();
      
      setStep("success");
    } catch (error: any) {
      console.error('Error processing deposit:', error);
      
      toast({
        title: "Erro no depósito",
        description: error.message || "Ocorreu um erro ao processar seu depósito",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const renderContent = () => {
    switch (step) {
      case "amount":
        return (
          <div className="p-5 space-y-6">
            <div className="nox-card border border-zinc-800">
              <h3 className="text-lg font-medium text-white mb-4">Quanto você quer depositar?</h3>
              
              <div className="space-y-4">
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-5 w-5 text-nox-primary" />
                  <Input 
                    className="pl-10 text-xl py-6 bg-nox-card text-white border-zinc-700 focus:border-nox-primary"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="R$ 0,00"
                  />
                </div>
                
                <Button 
                  onClick={handleContinue}
                  className="w-full bg-nox-primary hover:bg-nox-primary/90 text-white py-6"
                >
                  Continuar
                </Button>
              </div>
            </div>
            
            <div className="nox-card border border-zinc-800">
              <h3 className="text-lg font-medium text-white mb-4">Informações da conta</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <p className="text-nox-textSecondary">Nome</p>
                  <p className="text-white font-medium">{profile?.full_name}</p>
                </div>
                
                <div className="flex justify-between">
                  <p className="text-nox-textSecondary">Conta</p>
                  <p className="text-white">{profile?.account_number}</p>
                </div>
                
                <div className="flex justify-between">
                  <p className="text-nox-textSecondary">Saldo atual</p>
                  <p className="text-white">R$ {profile ? Number(profile.account_balance).toFixed(2).replace('.', ',') : '0,00'}</p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case "method":
        return (
          <div className="p-5 space-y-6">
            <div className="nox-card border border-zinc-800">
              <h3 className="text-lg font-medium text-white mb-4">Escolha o método de depósito</h3>
              
              <div className="space-y-3">
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedMethod === 'card' 
                      ? 'border-nox-primary bg-nox-primary/10' 
                      : 'border-zinc-700 hover:border-nox-primary/50'
                  }`}
                  onClick={() => setSelectedMethod('card')}
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-nox-primary/20 flex items-center justify-center mr-3">
                      <CreditCard className="h-5 w-5 text-nox-primary" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Cartão de crédito/débito</p>
                      <p className="text-sm text-nox-textSecondary">Depósito instantâneo</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedMethod === 'bank' 
                      ? 'border-nox-primary bg-nox-primary/10' 
                      : 'border-zinc-700 hover:border-nox-primary/50'
                  }`}
                  onClick={() => setSelectedMethod('bank')}
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-nox-primary/20 flex items-center justify-center mr-3">
                      <Landmark className="h-5 w-5 text-nox-primary" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Transferência bancária</p>
                      <p className="text-sm text-nox-textSecondary">Pode levar até 1 dia útil</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="nox-card border border-zinc-800">
              <h3 className="text-lg font-medium text-white mb-4">Resumo do depósito</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <p className="text-nox-textSecondary">Valor</p>
                  <p className="text-white font-medium">{amount}</p>
                </div>
                
                <div className="flex justify-between">
                  <p className="text-nox-textSecondary">Taxa</p>
                  <p className="text-white">R$ 0,00</p>
                </div>
                
                <div className="flex justify-between pt-2 border-t border-zinc-800">
                  <p className="text-nox-textSecondary">Total</p>
                  <p className="text-white font-medium">{amount}</p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleDeposit}
              className="w-full bg-nox-primary hover:bg-nox-primary/90 text-white py-6"
              disabled={isProcessing}
            >
              {isProcessing ? "Processando..." : "Confirmar depósito"}
            </Button>
          </div>
        );
        
      case "success":
        return (
          <div className="flex flex-col items-center justify-center h-[70vh] space-y-6 p-5">
            <div className="h-24 w-24 rounded-full bg-nox-primary/20 flex items-center justify-center mb-6 animate-pulse">
              <DollarSign className="h-12 w-12 text-nox-primary" />
            </div>
            
            <h2 className="text-2xl font-bold text-white">Depósito realizado!</h2>
            <p className="text-nox-textSecondary text-center">
              Seu depósito foi processado com sucesso e o valor já está disponível em sua conta.
            </p>
            
            <div className="bg-nox-card p-4 rounded-xl w-full">
              <div className="flex justify-between mb-2">
                <p className="text-nox-textSecondary">Valor depositado</p>
                <p className="text-white font-medium">{amount}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-nox-textSecondary">Método</p>
                <p className="text-white">
                  {selectedMethod === 'card' ? 'Cartão de crédito/débito' : 'Transferência bancária'}
                </p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-nox-textSecondary">Novo saldo</p>
                <p className="text-white font-medium">
                  R$ {profile ? Number(profile.account_balance).toFixed(2).replace('.', ',') : '0,00'}
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
              if (step === "method") {
                setStep("amount");
              } else if (step === "amount" || step === "success") {
                navigate('/home');
              }
            }}
          >
            <ArrowLeft className="h-5 w-5 text-nox-textSecondary" />
          </button>
          <h1 className="text-xl font-semibold text-white">
            {step === "success" ? "Depósito concluído" : "Depósito"}
          </h1>
        </div>
      </header>
      
      {renderContent()}
      
      <BottomNav activeTab="home" />
    </div>
  );
};

export default Deposit;
