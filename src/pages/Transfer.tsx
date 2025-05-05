import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Search, User, Clock, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/bottom-nav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AccountDisplay from "@/components/account-display";

interface Contact {
  id: string;
  username: string;
  full_name: string;
  account_number: string;
  avatar_url: string | null;
}

type TransferStep = "select-contact" | "amount" | "details" | "confirm" | "success";

const Transfer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, refreshProfile } = useAuth();
  const [step, setStep] = useState<TransferStep>("select-contact");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isNewTransfer, setIsNewTransfer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [allUsers, setAllUsers] = useState<Contact[]>([]);
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [newContactData, setNewContactData] = useState({
    accountNumber: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      
      try {
        console.log("Fetching all users");
        // Fetch all users except current user from the profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, full_name, account_number, avatar_url')
          .neq('id', user.id);

        if (error) {
          console.error('Error fetching users:', error);
          return;
        }

        // Filter out any null entries from data
        const validUsers = data.filter(contact => 
          contact && contact.account_number && contact.full_name
        );
        
        console.log("All users fetched:", validUsers.length);
        setAllUsers(validUsers);

        // Fetch recent contacts (users that the current user has transferred money to)
        const { data: transactions, error: transactionsError } = await supabase
          .from('transactions')
          .select(`
            receiver_id,
            profiles!transactions_receiver_id_fkey(id, username, full_name, account_number, avatar_url)
          `)
          .eq('sender_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (transactionsError) {
          console.error('Error fetching recent transactions:', transactionsError);
          return;
        }

        // Extract unique receivers and filter out null values
        const uniqueReceivers = transactions
          .filter(t => t.receiver_id !== user.id && t.profiles && t.profiles.account_number) // Exclude self-transfers and null profiles
          .reduce((acc, current) => {
            const receiver = current.profiles as Contact;
            if (!receiver) return acc;
            
            const exists = acc.find(item => item.id === receiver.id);
            if (!exists) {
              acc.push(receiver);
            }
            return acc;
          }, [] as Contact[]);

        console.log("Recent contacts fetched:", uniqueReceivers.length);
        setRecentContacts(uniqueReceivers);
      } catch (error) {
        console.error('Error in fetchUsers:', error);
      }
    };

    fetchUsers();
  }, [user]);

  // Updating search to use account_number instead of username
  useEffect(() => {
    if (searchTerm && searchTerm.length >= 2) {
      const delaySearch = setTimeout(() => {
        // Filtering users with valid account numbers 
        const filteredUsers = allUsers.filter(contact => {
          if (!contact || !contact.account_number || !contact.full_name) return false;
          
          // Remove any spaces or dashes from search term and account number
          const cleanSearchTerm = searchTerm.replace(/[\s-]/g, "").toLowerCase();
          const cleanAccountNumber = contact.account_number.replace(/[\s-]/g, "").toLowerCase();
            
          return cleanAccountNumber.includes(cleanSearchTerm) ||
                 contact.full_name.toLowerCase().includes(cleanSearchTerm);
        });
        
        console.log("Filtered users by search term:", filteredUsers.length);
        
        // Sorting to prioritize exact account number matches
        setAllUsers(prevUsers => {
          // Filter out invalid users first
          const validUsers = prevUsers.filter(user => user && user.account_number);
          
          // Then sort by relevance
          return validUsers.sort((a, b) => {
            if (!a || !a.account_number) return 1;
            if (!b || !b.account_number) return -1;
            
            // Clean search term and account numbers for comparison
            const cleanSearchTerm = searchTerm.replace(/[\s-]/g, "").toLowerCase();
            const cleanAccountA = a.account_number.replace(/[\s-]/g, "").toLowerCase();
            const cleanAccountB = b.account_number.replace(/[\s-]/g, "").toLowerCase();
              
            // Prioritizing exact matches
            if (cleanAccountA === cleanSearchTerm) return -1;
            if (cleanAccountB === cleanSearchTerm) return 1;
            
            // Then by partial matches
            const aMatch = cleanAccountA.includes(cleanSearchTerm) ? 1 : 0;
            const bMatch = cleanAccountB.includes(cleanSearchTerm) ? 1 : 0;
            return bMatch - aMatch;
          });
        });
      }, 300);
      
      return () => clearTimeout(delaySearch);
    }
  }, [searchTerm]);

  // Filtering contacts using account number
  const filteredContacts = recentContacts.filter(contact => {
    if (!contact || !contact.account_number || !contact.full_name) return false;
    
    if (!searchTerm) return true; // If no search term, show all recent contacts
    
    const cleanSearchTerm = searchTerm.replace(/[\s-]/g, "").toLowerCase();
    const cleanAccountNumber = contact.account_number.replace(/[\s-]/g, "").toLowerCase();
      
    return cleanAccountNumber.includes(cleanSearchTerm) ||
           contact.full_name.toLowerCase().includes(cleanSearchTerm);
  });

  // Filtering all users using account number
  const filteredAllUsers = searchTerm && searchTerm.length >= 2
    ? allUsers.filter(contact => {
        if (!contact || !contact.account_number || !contact.full_name) return false;
        
        const cleanSearchTerm = searchTerm.replace(/[\s-]/g, "").toLowerCase();
        const cleanAccountNumber = contact.account_number.replace(/[\s-]/g, "").toLowerCase();
          
        return cleanAccountNumber.includes(cleanSearchTerm) ||
               contact.full_name.toLowerCase().includes(cleanSearchTerm);
      })
    : [];

  const handleContactSelect = (contact: Contact) => {
    console.log("Selected contact:", contact);
    setSelectedContact(contact);
    setStep("amount");
  };

  const handleSearchAccount = async () => {
    if (!newContactData.accountNumber) {
      toast({
        title: "Erro",
        description: "Por favor, insira um número de conta válido",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    console.log("Searching for account:", newContactData.accountNumber);
    
    try {
      // Clean up the account number for searching
      let searchAccountNumber = newContactData.accountNumber.replace(/[\s-]/g, "");
      
      console.log("Cleaned search account number:", searchAccountNumber);
        
      // Search for the account in profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, account_number, avatar_url')
        .ilike('account_number', prepareAccountSearch(searchAccountNumber))
        .limit(10);

      if (error) {
        console.error('Error searching for account:', error);
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao buscar a conta: " + error.message,
          variant: "destructive",
        });
        setIsSearching(false);
        return;
      }

      // If no exact match, try fuzzy search (already done above but with stricter matching)
      if (!data || data.length === 0) {
        console.log("No account found");
        toast({
          title: "Conta não encontrada",
          description: "Não foi possível encontrar uma conta com este número",
          variant: "destructive",
        });
        setIsSearching(false);
        return;
      }
      
      // Check if any of the accounts found is the user themselves
      const filteredData = data.filter(u => u.id !== user?.id);
      
      if (filteredData.length === 0) {
        toast({
          title: "Erro",
          description: "Você não pode transferir para sua própria conta",
          variant: "destructive",
        });
        setIsSearching(false);
        return;
      }
      
      // Find exact match if possible
      const exactMatch = filteredData.find(u => 
        cleanAccountNumber(u.account_number) === searchAccountNumber.toUpperCase()
      );
      
      console.log("Account found:", exactMatch || filteredData[0]);
      setSelectedContact(exactMatch || filteredData[0]);
      setIsNewTransfer(false);
      setStep("amount");
    } catch (error: any) {
      console.error('Error in handleSearchAccount:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao buscar a conta: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleNewTransfer = () => {
    setIsNewTransfer(true);
    setStep("details");
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
    
    if (isNewTransfer) {
      setStep("details");
    } else {
      setStep("details");
    }
  };

  const handleDetailsSubmit = () => {
    setStep("confirm");
  };

  const handleConfirmTransfer = async () => {
    if (!user || !selectedContact) return;
    
    setIsLoading(true);
    
    try {
      const parsedAmount = parseFloat(amount.replace(/[^\d,]/g, "").replace(",", "."));
      
      // Call the transaction processing function via RPC
      const { data, error } = await supabase.rpc(
        'process_transaction',
        {
          sender_id: user.id,
          receiver_id: selectedContact.id,
          amount: parsedAmount,
          transaction_type: 'transfer',
          description: description || null
        }
      );

      if (error) {
        throw error;
      }

      // Refresh user profile to update balance
      await refreshProfile();
      
      setStep("success");
      
      // Mostrar toast de sucesso
      toast({
        title: "Transferência realizada",
        description: `Você transferiu ${amount} para ${selectedContact.full_name}`,
      });
    } catch (error: any) {
      console.error('Error processing transfer:', error);
      
      toast({
        title: "Erro na transferência",
        description: error.message || "Ocorreu um erro ao processar sua transferência",
        variant: "destructive",
      });
      
      setIsLoading(false);
    }
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

  const getInitials = (name: string) => {
    if (!name) return "??";
    
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
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
                placeholder="Buscar por número de conta"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <p className="text-xs text-nox-textSecondary mt-1">
                Exemplo: NOX-12345-67890
              </p>
            </div>
            
            <AccountDisplay label="Seu número de conta" className="mt-4" />
            
            <div className="space-y-4">
              {(searchTerm && filteredAllUsers.length > 0) && (
                <>
                  <h3 className="text-lg font-medium text-white">Resultados da busca</h3>
                  {filteredAllUsers.map(contact => (
                    <div 
                      key={contact.id} 
                      className="bg-nox-card p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border hover:border-nox-primary transition-all"
                      onClick={() => handleContactSelect(contact)}
                    >
                      <div className="flex items-center">
                        <Avatar className="h-12 w-12 mr-3">
                          {contact.avatar_url ? (
                            <img src={contact.avatar_url} alt={contact.full_name} />
                          ) : (
                            <AvatarFallback className="bg-nox-buttonInactive text-white">
                              {getInitials(contact.full_name)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="text-white font-medium">{contact.full_name}</p>
                          <p className="text-nox-textSecondary text-sm">{contact.account_number}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-nox-textSecondary" />
                    </div>
                  ))}
                </>
              )}
              
              {filteredContacts.length > 0 && (
                <>
                  <h3 className="text-lg font-medium text-white">Transferências recentes</h3>
                  {filteredContacts.map(contact => (
                    <div 
                      key={contact.id} 
                      className="bg-nox-card p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border hover:border-nox-primary transition-all"
                      onClick={() => handleContactSelect(contact)}
                    >
                      <div className="flex items-center">
                        <Avatar className="h-12 w-12 mr-3">
                          {contact.avatar_url ? (
                            <img src={contact.avatar_url} alt={contact.full_name} />
                          ) : (
                            <AvatarFallback className="bg-nox-buttonInactive text-white">
                              {getInitials(contact.full_name)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="text-white font-medium">{contact.full_name}</p>
                          <p className="text-nox-textSecondary text-sm">{contact.account_number}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-nox-textSecondary" />
                    </div>
                  ))}
                </>
              )}
              
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
                <Avatar className="h-12 w-12 mr-3">
                  {selectedContact?.avatar_url ? (
                    <img src={selectedContact.avatar_url} alt={selectedContact.full_name} />
                  ) : (
                    <AvatarFallback className="bg-nox-buttonInactive text-white">
                      {selectedContact ? getInitials(selectedContact.full_name) : 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-white font-medium">{selectedContact?.full_name}</p>
                  <p className="text-nox-textSecondary text-sm">{selectedContact?.account_number}</p>
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
              {profile && (
                <p className="text-sm text-nox-textSecondary text-right">
                  Saldo disponível: R$ {Number(profile.account_balance).toFixed(2).replace('.', ',')}
                </p>
              )}
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
            {!isNewTransfer && selectedContact ? (
              <div className="bg-nox-card p-4 rounded-xl">
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-3">
                    {selectedContact.avatar_url ? (
                      <img src={selectedContact.avatar_url} alt={selectedContact.full_name} />
                    ) : (
                      <AvatarFallback className="bg-nox-buttonInactive text-white">
                        {getInitials(selectedContact.full_name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="text-white font-medium">{selectedContact.full_name}</p>
                    <p className="text-nox-textSecondary text-sm">{selectedContact.account_number}</p>
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
                  <label className="text-nox-textSecondary text-sm">Número da conta</label>
                  <div className="relative flex">
                    <Input 
                      className="bg-nox-background text-white border-zinc-700 flex-1"
                      value={newContactData.accountNumber}
                      onChange={(e) => setNewContactData({...newContactData, accountNumber: e.target.value})}
                      placeholder="NOX-12345-67890"
                    />
                    <Button
                      className="ml-2 bg-nox-primary"
                      onClick={handleSearchAccount}
                      disabled={isSearching}
                    >
                      {isSearching ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
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
                  {profile && (
                    <p className="text-sm text-nox-textSecondary text-right">
                      Saldo disponível: R$ {Number(profile.account_balance).toFixed(2).replace('.', ',')}
                    </p>
                  )}
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
                disabled={!selectedContact}
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
                    {selectedContact?.full_name}
                  </p>
                </div>
                
                <div className="flex justify-between mt-2">
                  <p className="text-nox-textSecondary">Conta</p>
                  <p className="text-white">
                    {selectedContact?.account_number}
                  </p>
                </div>
                
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
                disabled={isLoading}
              >
                Voltar
              </Button>
              <Button 
                className="flex-1 py-6 bg-nox-primary hover:bg-nox-primary/90 text-white"
                onClick={handleConfirmTransfer}
                disabled={isLoading}
              >
                {isLoading ? "Processando..." : "Confirmar"}
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
                  {selectedContact?.full_name}
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
