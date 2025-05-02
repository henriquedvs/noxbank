
import { ArrowDown, ArrowUp, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

type TransactionType = 'income' | 'expense';

interface TransactionItemProps {
  type: TransactionType;
  title: string;
  category?: string;
  amount: number;
  date: string;
}

const TransactionIcon = ({ type }: { type: TransactionType }) => {
  if (type === 'income') {
    return (
      <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
        <ArrowDown className="h-5 w-5 text-emerald-500" />
      </div>
    );
  }
  
  return (
    <div className="h-10 w-10 rounded-full bg-rose-500/10 flex items-center justify-center">
      <ArrowUp className="h-5 w-5 text-rose-500" />
    </div>
  );
};

const TransactionItem = ({ 
  type, 
  title, 
  category = 'Transação',
  amount, 
  date 
}: TransactionItemProps) => {
  return (
    <div className="flex items-center justify-between p-3 border-b border-zinc-800 last:border-0">
      <div className="flex items-center">
        <TransactionIcon type={type} />
        <div className="ml-3">
          <h4 className="text-sm font-medium text-white">{title}</h4>
          <p className="text-xs text-nox-textSecondary">{category} • {date}</p>
        </div>
      </div>
      <div className={cn(
        "text-right",
        type === 'income' ? 'text-emerald-500' : 'text-rose-500'
      )}>
        <p className="font-medium">{type === 'income' ? '+' : '-'} R$ {amount.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default TransactionItem;
