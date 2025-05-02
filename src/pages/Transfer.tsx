
import { useState } from "react";
import { ArrowLeft, ArrowRight, Search, User, Clock, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/bottom-nav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Mock data for recent contacts
const recentContacts = [
  { id: 1, name: "Maria Silva", bankInfo: "NoxBank", accountNumber: "****3456", image: null },
  { id: 2, name: "Carlos Oliveira", bankInfo: "Banco X", accountNumber: "****7890", image: null },
  { id: 3, name: "Ana Pereira", bankInfo: "NoxBank", accountNumber: "****2345", image: null },
];

type TransferStep = "select-contact" | "amount" | "details" | "confirm" | "success";

const Transfer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<TransferStep>("select-contact");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState<typeof recentContacts[0] | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isNewTransfer, setIsNewTransfer] = useState(false);
  const [newContactData, setNewContactData] = useState({
    name: "",
    cpf: "",
    bank: "",
    agency: "",
    account: ""
  });

  const filteredContacts = recentContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactSelect = (contact: typeof recentContacts[0]) => {
    setSelectedContact(contact);
    setStep("amount");
  };

  const handleNewTransfer = () => {
    setIsNewTransfer(true);
    setStep("details");
  };

  const handleAmountSubmit = () => {
    if (!amount || parseFloat(amount.replace(/[^\d]/g, "")) / 100 <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor válido",
        variant: "destructive",
      });
      return;
    }
    setStep("details");
  };

  const handleDetailsSubmit = () => {
    setStep("confirm");
  };

  const handleConfirmTransfer = () => {
    // In a real app, we would call an API here
    setTimeout(() => {
      setStep("success");
    }, 1500);
  };

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

  const formatCurrency = (value: string) => {
    if (!value) return "R$ 0,00";
    return value;
  };

  const renderStepContent = () => {
    switch (step) {
      case "select-contact":
        return (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-nox-textSecondary" />
              <Input 
                className="pl-10 bg-nox-card text-white border-zinc-700"
                placeholder="Buscar contato"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Transferências recentes</h3>
              {filteredContacts.map(contact => (
                <div 
                  key={contact.id} 
                  className="bg-nox-card p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border hover:border-nox-primary transition-all"
                  onClick={() => handleContactSelect(contact)}
                >
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-nox-buttonInactive flex items-center justify-center mr-3">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{contact.name}</p>
                      <p className="text-nox-textSecondary text-sm">{contact.bankInfo} • {contact.accountNumber}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-nox-textSecondary" />
                </div>
              ))}
              
              <div 
                className="bg-nox-card p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border hover:border-nox-primary transition-all"
                onClick={handleNewTransfer}
              >
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-nox-primary/20 flex items-center justify-center mr-3">
                    <User className="h-6 w-6 text-nox-primary" />
                  </div>
                  <p className="text-white font-medium">Nova transferência</p>
                </div>
                <ArrowRight className="h-5 w-5 text-nox-textSecondary" />
              </div>
            </div>
          </div>
        );
        
      case "amount":
        return (
          <div className="space-y-6">
            <div className="bg-nox-card p-4 rounded-xl">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-nox-buttonInactive flex items-center justify-center mr-3">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">{selectedContact?.name}</p>
                  <p className="text-nox-textSecondary text-sm">{selectedContact?.bankInfo} • {selectedContact?.accountNumber}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-nox-textSecondary text-sm">Valor da transferência</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-nox-primary" />
                <Input 
                  className="pl-10 text-xl py-6 bg-nox-card text-white border-zinc-700 focus:border-nox-primary"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="R$ 0,00"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleAmountSubmit}
              className="w-full bg-nox-primary hover:bg-nox-primary/90 text-white py-6"
            >
              Continuar
            </Button>
          </div>
        );
        
      case "details":
        return (
          <div className="space-y-6">
            {!isNewTransfer ? (
              <div className="bg-nox-card p-4 rounded-xl">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-nox-buttonInactive flex items-center justify-center mr-3">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{selectedContact?.name}</p>
                    <p className="text-nox-textSecondary text-sm">{selectedContact?.bankInfo} • {selectedContact?.accountNumber}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-zinc-800">
                  <p className="text-nox-textSecondary text-sm">Valor</p>
                  <p className="text-white text-lg font-medium">{formatCurrency(amount)}</p>
                </div>
              </div>
            ) : (
              <div className="bg-nox-card p-4 rounded-xl space-y-4">
                <h3 className="text-lg font-medium text-white">Nova transferência</h3>
                
                <div className="space-y-2">
                  <label className="text-nox-textSecondary text-sm">Nome completo</label>
                  <Input 
                    className="bg-nox-background text-white border-zinc-700"
                    value={newContactData.name}
                    onChange={(e) => setNewContactData({...newContactData, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-nox-textSecondary text-sm">CPF/CNPJ</label>
                  <Input 
                    className="bg-nox-background text-white border-zinc-700"
                    value={newContactData.cpf}
                    onChange={(e) => setNewContactData({...newContactData, cpf: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-nox-textSecondary text-sm">Banco</label>
                  <Input 
                    className="bg-nox-background text-white border-zinc-700"
                    value={newContactData.bank}
                    onChange={(e) => setNewContactData({...newContactData, bank: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-nox-textSecondary text-sm">Agência</label>
                    <Input 
                      className="bg-nox-background text-white border-zinc-700"
                      value={newContactData.agency}
                      onChange={(e) => setNewContactData({...newContactData, agency: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-nox-textSecondary text-sm">Conta</label>
                    <Input 
                      className="bg-nox-background text-white border-zinc-700"
                      value={newContactData.account}
                      onChange={(e) => setNewContactData({...newContactData, account: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-nox-textSecondary text-sm">Valor da transferência</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-nox-primary" />
                    <Input 
                      className="pl-10 text-xl py-6 bg-nox-background text-white border-zinc-700"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="R$ 0,00"
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-nox-textSecondary text-sm">Descrição (opcional)</label>
              <Input 
                className="bg-nox-card text-white border-zinc-700"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Pagamento de aluguel"
              />
            </div>
            
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                className="flex-1 py-6 border-nox-textSecondary bg-transparent text-white hover:bg-nox-card"
                onClick={() => setStep("select-contact")}
              >
                <Clock className="mr-2 h-5 w-5" />
                Agendar
              </Button>
              <Button 
                className="flex-1 py-6 bg-nox-primary hover:bg-nox-primary/90 text-white"
                onClick={handleDetailsSubmit}
              >
                Transferir agora
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
                <p className="text-white text-3xl font-bold mt-1">{formatCurrency(amount)}</p>
              </div>
              
              <div className="border-t border-zinc-800 pt-4">
                <div className="flex justify-between">
                  <p className="text-nox-textSecondary">Para</p>
                  <p className="text-white font-medium">
                    {isNewTransfer ? newContactData.name : selectedContact?.name}
                  </p>
                </div>
                
                <div className="flex justify-between mt-2">
                  <p className="text-nox-textSecondary">Banco</p>
                  <p className="text-white">
                    {isNewTransfer ? newContactData.bank : selectedContact?.bankInfo}
                  </p>
                </div>
                
                {isNewTransfer && (
                  <>
                    <div className="flex justify-between mt-2">
                      <p className="text-nox-textSecondary">Agência</p>
                      <p className="text-white">{newContactData.agency}</p>
                    </div>
                    <div className="flex justify-between mt-2">
                      <p className="text-nox-textSecondary">Conta</p>
                      <p className="text-white">{newContactData.account}</p>
                    </div>
                  </>
                )}
                
                {description && (
                  <div className="flex justify-between mt-2">
                    <p className="text-nox-textSecondary">Descrição</p>
                    <p className="text-white">{description}</p>
                  </div>
                )}
                
                <div className="flex justify-between mt-2">
                  <p className="text-nox-textSecondary">Data</p>
                  <p className="text-white">{new Date().toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-nox-card p-4 rounded-xl">
              <p className="text-nox-textSecondary text-sm">
                Ao confirmar, você concorda com os nossos termos e condições para transferências bancárias.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                className="flex-1 py-6 border-nox-textSecondary bg-transparent text-white hover:bg-nox-card"
                onClick={() => setStep("details")}
              >
                Voltar
              </Button>
              <Button 
                className="flex-1 py-6 bg-nox-primary hover:bg-nox-primary/90 text-white"
                onClick={handleConfirmTransfer}
              >
                Confirmar
              </Button>
            </div>
          </div>
        );
        
      case "success":
        return (
          <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
            <div className="h-24 w-24 rounded-full bg-nox-primary/20 flex items-center justify-center mb-6 animate-pulse">
              <ArrowRight className="h-12 w-12 text-nox-primary" />
            </div>
            
            <h2 className="text-2xl font-bold text-white">Transferência realizada!</h2>
            <p className="text-nox-textSecondary text-center">
              Sua transferência foi processada com sucesso e o dinheiro estará disponível em instantes.
            </p>
            
            <div className="bg-nox-card p-4 rounded-xl w-full">
              <div className="flex justify-between mb-2">
                <p className="text-nox-textSecondary">Valor transferido</p>
                <p className="text-white font-medium">{formatCurrency(amount)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-nox-textSecondary">Para</p>
                <p className="text-white">
                  {isNewTransfer ? newContactData.name : selectedContact?.name}
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
            onClick={() => step === "select-contact" ? navigate('/home') : setStep("select-contact")}
          >
            <ArrowLeft className="h-5 w-5 text-nox-textSecondary" />
          </button>
          <h1 className="text-xl font-semibold text-white">
            {step === "success" ? "Transferência" : (
              step === "amount" ? "Valor" : (
                step === "details" ? "Detalhes" : (
                  step === "confirm" ? "Confirmação" : "Transferência"
                )
              )
            )}
          </h1>
        </div>
      </header>
      
      <div className="px-5">
        {renderStepContent()}
      </div>
      
      <BottomNav activeTab="home" />
    </div>
  );
};

export default Transfer;
