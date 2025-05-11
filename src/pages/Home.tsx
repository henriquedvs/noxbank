
import { useState, useEffect } from "react";
import { BellRing, ChevronRight, Plus, ArrowUpRight, ArrowDownLeft, Calendar, CreditCard } from "lucide-react";
import BottomNav from "@/components/bottom-nav";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationsContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  title: string;
  category: string;
  amount: number;
  date: string;
}

interface Friend {
  id: string;
  avatar_url: string | null;
  username: string;
  full_name: string;
}

const Home = () => {
  const [greeting, setGreeting] = useState("Olá");
  const [showNotifications, setShowNotifications] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
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

        const formattedTransactions = data.map(t => {
          const isSender = t.sender_id === profile.id;
          const isDeposit = t.sender_id === t.receiver_id;
          
          const transactionType: 'income' | 'expense' = isSender && !isDeposit ? 'expense' : 'income';
          
          return {
            id: t.id,
            type: transactionType,
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

    // Fetch friends (recent contacts)
    const fetchFriends = async () => {
      if (!profile) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .neq('id', profile.id)
          .limit(4);

        if (error) {
          console.error('Error fetching friends:', error);
          return;
        }

        setFriends(data || []);
      } catch (error) {
        console.error('Error in fetchFriends:', error);
      }
    };

    fetchTransactions();
    fetchFriends();
  }, [profile]);

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "??";
    
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="p-5 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">{greeting},</p>
            <h1 className="text-xl font-semibold text-gray-800">{profile?.full_name || 'Carregando...'}</h1>
          </div>
          <button 
            className="p-2 rounded-full bg-gray-100 relative"
            onClick={() => setShowNotifications(true)}
          >
            <BellRing className="h-6 w-6 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-nox-primary rounded-full"></span>
            )}
          </button>
        </div>
      </header>
      
      {/* Main Balance Card */}
      <div className="px-5 -mt-2">
        <div className="nox-card-gradient p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-white/70 text-sm">Saldo Atual</div>
            <button 
              className="bg-white/20 rounded-full py-1 px-3 flex items-center text-sm text-white"
              onClick={() => navigate('/deposit')}
            >
              <Plus className="h-4 w-4 mr-1" />
              <span>Depositar</span>
            </button>
          </div>
          
          <div className="text-3xl font-semibold text-white mb-5">
            R$ {profile ? Number(profile.account_balance).toFixed(2).replace('.', ',') : '0,00'}
          </div>
          
          <div className="mb-2">
            <div className="flex justify-between text-xs text-white/80 mb-1">
              <span>50%</span>
              <span>R$ {profile ? Number(profile.account_balance).toFixed(2) : '0,00'} / R$ 1.000,00</span>
            </div>
            <Progress value={profile ? Math.min((Number(profile.account_balance) / 1000) * 100, 100) : 0} className="h-1.5 bg-white/30" />
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="px-5">
        <div className="grid grid-cols-4 gap-2 mb-6">
          <button 
            className="nox-avatar-item"
            onClick={() => navigate('/transfer')}
          >
            <div className="h-10 w-10 rounded-full bg-nox-primary/10 flex items-center justify-center mb-2">
              <ArrowUpRight className="h-5 w-5 text-nox-primary" />
            </div>
            <span className="text-xs text-gray-700">Enviar</span>
          </button>
          
          <button 
            className="nox-avatar-item"
            onClick={() => navigate('/deposit')}
          >
            <div className="h-10 w-10 rounded-full bg-nox-primary/10 flex items-center justify-center mb-2">
              <ArrowDownLeft className="h-5 w-5 text-nox-primary" />
            </div>
            <span className="text-xs text-gray-700">Depositar</span>
          </button>
          
          <button 
            className="nox-avatar-item"
            onClick={() => navigate('/payment')}
          >
            <div className="h-10 w-10 rounded-full bg-nox-primary/10 flex items-center justify-center mb-2">
              <Calendar className="h-5 w-5 text-nox-primary" />
            </div>
            <span className="text-xs text-gray-700">Pagar</span>
          </button>
          
          <button 
            className="nox-avatar-item"
            onClick={() => navigate('/cards')}
          >
            <div className="h-10 w-10 rounded-full bg-nox-primary/10 flex items-center justify-center mb-2">
              <CreditCard className="h-5 w-5 text-nox-primary" />
            </div>
            <span className="text-xs text-gray-700">Cartões</span>
          </button>
        </div>
      </div>
      
      {/* Friends */}
      <div className="px-5 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Seus Amigos</h3>
          <button 
            className="text-nox-primary text-sm flex items-center"
            onClick={() => navigate('/search-users')}
          >
            Ver todos <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {friends.length > 0 ? (
            friends.map((friend) => (
              <div 
                key={friend.id}
                className="flex flex-col items-center min-w-[80px]"
                onClick={() => navigate(`/transfer?selectedUser=${encodeURIComponent(JSON.stringify(friend))}`)}
              >
                <Avatar className="h-14 w-14 mb-2 border-2 border-nox-primary/20">
                  {friend.avatar_url ? (
                    <AvatarImage src={friend.avatar_url} alt={friend.full_name} />
                  ) : (
                    <AvatarFallback className="bg-gray-200 text-gray-700">
                      {getInitials(friend.full_name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="text-xs text-gray-700 text-center truncate w-full">
                  {friend.username}
                </span>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center w-full py-4 text-gray-400">
              <p>Nenhum amigo encontrado</p>
              <button 
                className="text-nox-primary text-sm mt-2"
                onClick={() => navigate('/search-users')}
              >
                Adicionar amigos
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Activities */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Atividades recentes</h3>
          <button 
            className="text-nox-primary text-sm flex items-center"
            onClick={() => navigate('/finance')}
          >
            Ver todas <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        <div className="nox-card mb-6">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-3 border-b last:border-b-0 border-gray-100">
                <div className="flex items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowDownLeft className="h-5 w-5 text-green-600" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">{transaction.title}</p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <p className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-5 text-gray-400">
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
        <DialogContent className="bg-white border-gray-200 text-gray-800 max-w-md">
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
                  className={`p-3 mb-2 rounded-lg ${notification.is_read ? 'bg-gray-50' : 'bg-green-50 border border-green-100'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between">
                    <h4 className="font-semibold text-gray-800">{notification.title}</h4>
                    <p className="text-xs text-gray-500">
                      {new Date(notification.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <p className="text-sm mt-1 text-gray-600">{notification.content}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-400">
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
