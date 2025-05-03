
import { useState, useEffect } from "react";
import { BellRing, ChevronRight } from "lucide-react";
import BottomNav from "@/components/bottom-nav";
import CreditCard from "@/components/credit-card";
import QuickActions from "@/components/quick-actions";
import TransactionItem from "@/components/transaction-item";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationsContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  title: string;
  category: string;
  amount: number;
  date: string;
}

const Home = () => {
  const [greeting, setGreeting] = useState("Olá");
  const [showNotifications, setShowNotifications] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { profile } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  // Update greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bom dia");
    else if (hour < 18) setGreeting("Boa tarde");
    else setGreeting("Boa noite");
  }, []);

  useEffect(() => {
    // Fetch recent transactions
    const fetchTransactions = async () => {
      if (!profile) return;

      try {
        const { data, error } = await supabase
          .from('transactions')
          .select(`
            id,
            amount,
            transaction_type,
            description,
            created_at,
            sender_id,
            receiver_id,
            profiles!transactions_sender_id_fkey(username)
          `)
          .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching transactions:', error);
          return;
        }

        // Transform transactions to match the required format
        const formattedTransactions = data.map(t => {
          const isSender = t.sender_id === profile.id;
          const isDeposit = t.sender_id === t.receiver_id;
          
          return {
            id: t.id,
            type: isSender && !isDeposit ? 'expense' : 'income',
            title: isDeposit ? 'Depósito' : (isSender ? `Para ${t.profiles?.username || 'Desconhecido'}` : `De ${t.profiles?.username || 'Desconhecido'}`),
            category: t.transaction_type.charAt(0).toUpperCase() + t.transaction_type.slice(1),
            amount: Number(t.amount),
            date: new Date(t.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
          };
        });

        setTransactions(formattedTransactions);
      } catch (error) {
        console.error('Error in fetchTransactions:', error);
      }
    };

    fetchTransactions();
  }, [profile]);

  return (
    <div className="min-h-screen bg-nox-background pb-20">
      {/* Header */}
      <header className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-nox-textSecondary text-sm">{greeting},</p>
            <h1 className="text-xl font-semibold text-white">{profile?.full_name || 'Carregando...'}</h1>
          </div>
          <button 
            className="p-2 rounded-full bg-nox-card relative"
            onClick={() => setShowNotifications(true)}
          >
            <BellRing className="h-6 w-6 text-nox-textSecondary" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-nox-primary rounded-full"></span>
            )}
          </button>
        </div>
      </header>
      
      {/* Card */}
      <div className="px-5 mb-6">
        <CreditCard
          cardNumber={profile?.account_number || 'Carregando...'}
          name={profile?.full_name || 'Carregando...'}
          expiryDate="12/28"
          balance={profile ? Number(profile.account_balance) : 0}
        />
      </div>
      
      {/* Quick Actions */}
      <QuickActions />
      
      {/* Recent Transactions */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">Transações recentes</h3>
          <button 
            className="flex items-center text-nox-primary text-sm"
            onClick={() => navigate('/finance')}
          >
            Ver todas <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        <div className="bg-nox-card rounded-xl overflow-hidden">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                type={transaction.type}
                title={transaction.title}
                category={transaction.category}
                amount={transaction.amount}
                date={transaction.date}
              />
            ))
          ) : (
            <div className="p-6 text-center text-nox-textSecondary">
              <p>Nenhuma transação recente</p>
              <p className="text-sm mt-2">
                Experimente transferir ou receber valores para ver seu histórico aqui.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Notifications Dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="bg-nox-card border-zinc-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex justify-between">
              <span>Notificações</span>
              {notifications.length > 0 && (
                <Button 
                  variant="ghost" 
                  className="text-sm text-nox-primary hover:text-nox-primary hover:bg-nox-primary/10"
                  onClick={() => markAllAsRead()}
                >
                  Marcar todas como lidas
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-3 mb-2 rounded-lg ${notification.is_read ? 'bg-zinc-800/30' : 'bg-nox-primary/10 border border-nox-primary/20'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between">
                    <h4 className="font-semibold">{notification.title}</h4>
                    <p className="text-xs text-nox-textSecondary">
                      {new Date(notification.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <p className="text-sm mt-1 text-nox-textSecondary">{notification.content}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-nox-textSecondary">
                <p>Nenhuma notificação</p>
                <p className="text-sm mt-2">
                  As notificações sobre suas transações aparecerão aqui.
                </p>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      <BottomNav activeTab="home" />
    </div>
  );
};

export default Home;
