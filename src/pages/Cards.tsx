
import BottomNav from "@/components/bottom-nav";
import { CreditCard as CardIcon, Eye, EyeOff, Lock, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import CreditCard from "@/components/credit-card";
import { Button } from "@/components/ui/button";

const Cards = () => {
  const [showCardDetails, setShowCardDetails] = useState(false);

  return (
    <div className="min-h-screen bg-nox-background pb-20">
      {/* Header */}
      <header className="p-5">
        <h1 className="text-xl font-semibold text-white">Meus Cartões</h1>
      </header>
      
      {/* Physical Card */}
      <div className="px-5 mb-6">
        <CreditCard
          cardNumber="4512 3456 7890 1234"
          name="JOÃO M SILVA"
          expiryDate="12/28"
          balance={5284.75}
          className="mb-4"
        />
        
        <div className="bg-nox-card rounded-xl overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-nox-primary/10 flex items-center justify-center mr-3">
                  <CardIcon className="h-5 w-5 text-nox-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Cartão físico</h4>
                  <p className="text-xs text-nox-textSecondary">Mastercard</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="text-nox-primary border-nox-primary/30 hover:bg-nox-primary/10"
                onClick={() => setShowCardDetails(!showCardDetails)}
              >
                {showCardDetails ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                {showCardDetails ? "Esconder" : "Mostrar"}
              </Button>
            </div>
            
            {showCardDetails ? (
              <div className="animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-nox-textSecondary mb-1">Número</p>
                    <p className="text-white font-medium">4512 3456 7890 1234</p>
                  </div>
                  <div>
                    <p className="text-xs text-nox-textSecondary mb-1">Validade</p>
                    <p className="text-white font-medium">12/28</p>
                  </div>
                  <div>
                    <p className="text-xs text-nox-textSecondary mb-1">CVV</p>
                    <p className="text-white font-medium">123</p>
                  </div>
                  <div>
                    <p className="text-xs text-nox-textSecondary mb-1">Nome</p>
                    <p className="text-white font-medium">JOÃO M SILVA</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-nox-textSecondary mb-1">Final</p>
                  <p className="text-white font-medium">1234</p>
                </div>
                <div>
                  <p className="text-xs text-nox-textSecondary mb-1">Limite</p>
                  <p className="text-white font-medium">R$ 8.500</p>
                </div>
                <div>
                  <p className="text-xs text-nox-textSecondary mb-1">Usado</p>
                  <p className="text-white font-medium">R$ 3.215</p>
                </div>
                <div>
                  <p className="text-xs text-nox-textSecondary mb-1">Status</p>
                  <p className="text-emerald-500 font-medium">Ativo</p>
                </div>
              </div>
            )}
            
            <div className="flex mt-5 pt-4 border-t border-zinc-800">
              <button className="flex items-center justify-center flex-1 text-center text-nox-textSecondary text-sm">
                <Lock className="h-4 w-4 mr-2" />
                Bloquear
              </button>
              <button className="flex items-center justify-center flex-1 text-center text-nox-primary text-sm">
                Configurar
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Virtual Card */}
      <div className="px-5">
        <h3 className="text-lg font-semibold text-white mb-2">Cartões virtuais</h3>
        
        <div className="bg-nox-card rounded-xl overflow-hidden mb-6">
          <div className="p-5 flex items-center">
            <div className="h-12 w-12 rounded-full bg-nox-primary/10 flex items-center justify-center mr-4">
              <Plus className="h-6 w-6 text-nox-primary" />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-medium">Criar cartão virtual</h4>
              <p className="text-sm text-nox-textSecondary">Para compras online mais seguras</p>
            </div>
            <ChevronRight className="h-5 w-5 text-nox-textSecondary" />
          </div>
        </div>
      </div>
      
      <BottomNav activeTab="cards" />
    </div>
  );
};

export default Cards;
