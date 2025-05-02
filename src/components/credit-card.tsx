
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CreditCardProps {
  cardNumber: string;
  name: string;
  expiryDate: string;
  balance: number;
  className?: string;
}

const CreditCard = ({
  cardNumber,
  name,
  expiryDate,
  balance,
  className,
}: CreditCardProps) => {
  const [showBalance, setShowBalance] = useState(false);
  const lastFourDigits = cardNumber.slice(-4);

  return (
    <div 
      className={cn(
        "relative w-full h-52 rounded-2xl p-5 overflow-hidden",
        "bg-gradient-to-br from-nox-primary/80 to-nox-primary shadow-lg",
        className
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 w-full h-full opacity-10">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-black/10"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-black/10"></div>
      </div>
      
      <div className="relative h-full flex flex-col justify-between">
        {/* Card top section */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/70 text-xs">Seu saldo disponível</p>
            <div className="flex items-center mt-1">
              {showBalance ? (
                <span className="text-2xl font-bold text-white">
                  R$ {balance.toFixed(2)}
                </span>
              ) : (
                <span className="text-2xl font-bold text-white">••••••</span>
              )}
              <button 
                onClick={() => setShowBalance(!showBalance)} 
                className="ml-2 p-1"
              >
                {showBalance ? (
                  <EyeOff className="h-4 w-4 text-white/70" />
                ) : (
                  <Eye className="h-4 w-4 text-white/70" />
                )}
              </button>
            </div>
          </div>
          
          <div className="w-10 h-10">
            <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" opacity="0.7" />
              <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        
        {/* Card bottom section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-white font-medium">•••• •••• •••• {lastFourDigits}</p>
            <p className="text-sm text-white/70">Válido até {expiryDate}</p>
          </div>
          <p className="text-white font-medium">{name}</p>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;
