
import { useState } from "react";
import { Banknote, Copy, FileText, ArrowDownCircle } from "lucide-react";
import BottomNav from "@/components/bottom-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const Deposit = () => {
  const [depositAmount, setDepositAmount] = useState("");
  
  const mockBankDetails = {
    bank: "NoxBank",
    name: "João M Silva",
    agency: "0001",
    account: "12345-6",
    cpf: "123.456.789-00"
  };
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência.`
    });
  };
  
  const generateBoleto = () => {
    if (!depositAmount || parseFloat(depositAmount.replace(/[^\d.,]/g, '').replace(',', '.')) <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido para gerar o boleto.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would call an API to generate a boleto
    toast({
      title: "Boleto gerado!",
      description: "O boleto foi gerado e enviado para seu email."
    });
  };
  
  // Format currency as user types
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbers = value.replace(/\D/g, "");
    
    if (numbers === "") {
      setDepositAmount("");
      return;
    }
    
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(parseFloat(numbers) / 100);
    
    setDepositAmount(formatted);
  };

  return (
    <div className="min-h-screen bg-nox-background pb-20">
      {/* Header */}
      <header className="p-5">
        <h1 className="text-xl font-semibold text-white">Depositar</h1>
        <p className="text-nox-textSecondary mt-1">Adicione dinheiro à sua conta</p>
      </header>
      
      {/* Options */}
      <div className="p-5 space-y-6">
        {/* Option 1: Generate Boleto */}
        <div className="nox-card border border-zinc-800">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-nox-primary/20 to-nox-primary/10 flex items-center justify-center mr-3">
              <FileText className="h-5 w-5 text-nox-primary" />
            </div>
            <h2 className="text-lg font-medium text-white">Gerar Boleto Bancário</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount" className="text-nox-textSecondary">Valor do depósito</Label>
              <Input 
                id="amount"
                type="text"
                value={depositAmount}
                onChange={handleAmountChange}
                placeholder="R$ 0,00"
                className="nox-input mt-1"
              />
            </div>
            
            <Button 
              onClick={generateBoleto} 
              className="w-full nox-button-primary"
            >
              Gerar Boleto
            </Button>
          </div>
        </div>
        
        {/* Option 2: Transfer from another bank */}
        <div className="nox-card border border-zinc-800">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-nox-primary/20 to-nox-primary/10 flex items-center justify-center mr-3">
              <Banknote className="h-5 w-5 text-nox-primary" />
            </div>
            <h2 className="text-lg font-medium text-white">Transferência de Outro Banco</h2>
          </div>
          
          <div className="space-y-3 text-nox-textSecondary">
            <div className="flex justify-between items-center">
              <span>Banco</span>
              <div className="flex items-center">
                <span className="text-white">{mockBankDetails.bank}</span>
                <button 
                  onClick={() => copyToClipboard(mockBankDetails.bank, "Banco")}
                  className="ml-2 text-nox-primary"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Nome</span>
              <div className="flex items-center">
                <span className="text-white">{mockBankDetails.name}</span>
                <button 
                  onClick={() => copyToClipboard(mockBankDetails.name, "Nome")}
                  className="ml-2 text-nox-primary"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Agência</span>
              <div className="flex items-center">
                <span className="text-white">{mockBankDetails.agency}</span>
                <button 
                  onClick={() => copyToClipboard(mockBankDetails.agency, "Agência")}
                  className="ml-2 text-nox-primary"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Conta</span>
              <div className="flex items-center">
                <span className="text-white">{mockBankDetails.account}</span>
                <button 
                  onClick={() => copyToClipboard(mockBankDetails.account, "Conta")}
                  className="ml-2 text-nox-primary"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>CPF</span>
              <div className="flex items-center">
                <span className="text-white">{mockBankDetails.cpf}</span>
                <button 
                  onClick={() => copyToClipboard(mockBankDetails.cpf, "CPF")}
                  className="ml-2 text-nox-primary"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Option 3: Check deposit (future feature) */}
        <div className="nox-card border border-zinc-800 opacity-70">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-nox-primary/20 to-nox-primary/10 flex items-center justify-center mr-3">
              <ArrowDownCircle className="h-5 w-5 text-nox-primary" />
            </div>
            <h2 className="text-lg font-medium text-white">Depósito por Cheque</h2>
          </div>
          
          <div className="text-nox-textSecondary italic">
            <p>Funcionalidade em desenvolvimento. Em breve será possível depositar cheques usando a câmera do seu celular.</p>
          </div>
        </div>
      </div>
      
      <BottomNav activeTab="home" />
    </div>
  );
};

export default Deposit;
