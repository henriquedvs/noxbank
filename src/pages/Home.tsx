
import { useState, useEffect } from "react";
import { BellRing, ChevronRight } from "lucide-react";
import BottomNav from "@/components/bottom-nav";
import CreditCard from "@/components/credit-card";
import QuickActions from "@/components/quick-actions";
import TransactionItem from "@/components/transaction-item";

const mockTransactions = [
  {
    id: 1,
    type: 'expense' as const,
    title: 'Mercado Livre',
    category: 'Compras',
    amount: 129.90,
    date: '20/05'
  },
  {
    id: 2,
    type: 'income' as const,
    title: 'Depósito RecebidoX',
    category: 'Transferência',
    amount: 500.00,
    date: '19/05'
  },
  {
    id: 3,
    type: 'expense' as const,
    title: 'Netflix',
    category: 'Assinatura',
    amount: 39.90,
    date: '18/05'
  },
  {
    id: 4,
    type: 'expense' as const,
    title: 'Uber',
    category: 'Transporte',
    amount: 24.30,
    date: '18/05'
  }
];

const Home = () => {
  const [greeting, setGreeting] = useState("Olá");

  // Update greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bom dia");
    else if (hour < 18) setGreeting("Boa tarde");
    else setGreeting("Boa noite");
  }, []);

  return (
    <div className="min-h-screen bg-nox-background pb-20">
      {/* Header */}
      <header className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-nox-textSecondary text-sm">{greeting},</p>
            <h1 className="text-xl font-semibold text-white">João Silva</h1>
          </div>
          <button className="p-2 rounded-full bg-nox-card relative">
            <BellRing className="h-6 w-6 text-nox-textSecondary" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-nox-primary rounded-full"></span>
          </button>
        </div>
      </header>
      
      {/* Card */}
      <div className="px-5 mb-6">
        <CreditCard
          cardNumber="4512 3456 7890 1234"
          name="JOÃO M SILVA"
          expiryDate="12/28"
          balance={5284.75}
        />
      </div>
      
      {/* Quick Actions */}
      <QuickActions />
      
      {/* Recent Transactions */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">Transações recentes</h3>
          <button className="flex items-center text-nox-primary text-sm">
            Ver todas <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
        
        <div className="bg-nox-card rounded-xl overflow-hidden">
          {mockTransactions.map(transaction => (
            <TransactionItem
              key={transaction.id}
              type={transaction.type}
              title={transaction.title}
              category={transaction.category}
              amount={transaction.amount}
              date={transaction.date}
            />
          ))}
        </div>
      </div>
      
      <BottomNav activeTab="home" />
    </div>
  );
};

export default Home;
