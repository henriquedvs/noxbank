
import { useState } from "react";
import { QrCode, Copy, Key, Clock, Receipt, ArrowUpRight } from "lucide-react";
import BottomNav from "@/components/bottom-nav";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const PixOption = ({ 
  icon: Icon, 
  title, 
  description,
  onClick 
}: { 
  icon: React.ElementType; 
  title: string;
  description: string;
  onClick?: () => void;
}) => {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center p-4 bg-nox-card rounded-xl border border-zinc-800 hover:border-nox-primary/50 transition-all"
    >
      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-nox-primary/20 to-nox-primary/10 flex items-center justify-center mr-4">
        <Icon className="h-6 w-6 text-nox-primary" />
      </div>
      <div className="text-left">
        <h3 className="text-white font-medium">{title}</h3>
        <p className="text-sm text-nox-textSecondary">{description}</p>
      </div>
    </button>
  );
};

const Pix = () => {
  const [activeTab, setActiveTab] = useState<'send' | 'receive' | 'keys' | 'scheduled' | 'history'>('send');
  
  const pixKeys = [
    { type: 'CPF', value: '123.456.789-00', registered: true },
    { type: 'Email', value: 'joao.silva@email.com', registered: true },
    { type: 'Telefone', value: '+55 (11) 98765-4321', registered: false },
    { type: 'Aleatória', value: '28c7e8b9-9a87-4b43-a0cf-5c5e73c8b2d1', registered: true }
  ];
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "A chave Pix foi copiada para a área de transferência."
    });
  };
  
  const openTransferPage = () => {
    // In a real app, this would navigate to the transfer page
    console.log("Navigate to transfer page");
  };
  
  return (
    <div className="min-h-screen bg-nox-background pb-20">
      {/* Header */}
      <header className="p-5">
        <h1 className="text-xl font-semibold text-white">Pix</h1>
        <p className="text-nox-textSecondary mt-1">Pagamentos instantâneos</p>
      </header>
      
      {/* Tab Navigation */}
      <div className="px-5">
        <div className="flex overflow-x-auto space-x-2 pb-2">
          <Button 
            variant={activeTab === 'send' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('send')}
            className={`flex-shrink-0 ${activeTab === 'send' ? 'bg-nox-primary hover:bg-nox-primary/90' : 'border-zinc-700 text-white'}`}
          >
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Enviar
          </Button>
          <Button 
            variant={activeTab === 'receive' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('receive')}
            className={`flex-shrink-0 ${activeTab === 'receive' ? 'bg-nox-primary hover:bg-nox-primary/90' : 'border-zinc-700 text-white'}`}
          >
            <QrCode className="h-4 w-4 mr-2" />
            Receber
          </Button>
          <Button 
            variant={activeTab === 'keys' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('keys')}
            className={`flex-shrink-0 ${activeTab === 'keys' ? 'bg-nox-primary hover:bg-nox-primary/90' : 'border-zinc-700 text-white'}`}
          >
            <Key className="h-4 w-4 mr-2" />
            Chaves
          </Button>
          <Button 
            variant={activeTab === 'scheduled' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('scheduled')}
            className={`flex-shrink-0 ${activeTab === 'scheduled' ? 'bg-nox-primary hover:bg-nox-primary/90' : 'border-zinc-700 text-white'}`}
          >
            <Clock className="h-4 w-4 mr-2" />
            Agendados
          </Button>
          <Button 
            variant={activeTab === 'history' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('history')}
            className={`flex-shrink-0 ${activeTab === 'history' ? 'bg-nox-primary hover:bg-nox-primary/90' : 'border-zinc-700 text-white'}`}
          >
            <Receipt className="h-4 w-4 mr-2" />
            Histórico
          </Button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="p-5">
        {activeTab === 'send' && (
          <div className="space-y-4">
            <PixOption 
              icon={Key} 
              title="Transferir com chave Pix" 
              description="Envie para CPF, email, telefone ou chave aleatória"
              onClick={openTransferPage}
            />
            <PixOption 
              icon={QrCode} 
              title="Pagar com QR Code" 
              description="Escaneie o código para pagar"
              onClick={() => {}}
            />
          </div>
        )}
        
        {activeTab === 'receive' && (
          <div className="space-y-4">
            <div className="nox-card border border-zinc-800">
              <h3 className="text-white mb-4">Seu QR Code Pix</h3>
              
              <div className="bg-white p-4 rounded-lg flex items-center justify-center mb-4">
                <QrCode className="h-40 w-40 text-black" />
              </div>
              
              <Button className="w-full nox-button-primary">
                Compartilhar QR Code
              </Button>
            </div>
            
            <div className="nox-card border border-zinc-800">
              <h3 className="text-white mb-4">Sua chave Pix principal</h3>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-nox-textSecondary">CPF</p>
                  <p className="text-white">123.456.789-00</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => copyToClipboard("123.456.789-00")}
                  className="border-nox-primary text-nox-primary"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'keys' && (
          <div className="space-y-4">
            {pixKeys.map((key, index) => (
              <div key={index} className="nox-card border border-zinc-800">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-nox-textSecondary">{key.type}</p>
                    <p className="text-white">{key.value}</p>
                  </div>
                  <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full mr-2 ${key.registered ? 'bg-nox-primary' : 'bg-nox-buttonInactive'}`}></div>
                    <span className="text-xs text-nox-textSecondary mr-4">
                      {key.registered ? 'Ativa' : 'Inativa'}
                    </span>
                    <Button 
                      variant="ghost" 
                      onClick={() => copyToClipboard(key.value)}
                      className="text-nox-primary p-2 h-auto"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            <Button className="w-full nox-button-primary">
              Cadastrar nova chave Pix
            </Button>
          </div>
        )}
        
        {activeTab === 'scheduled' && (
          <div className="flex flex-col items-center justify-center h-60">
            <Clock className="h-12 w-12 text-nox-textSecondary mb-4" />
            <p className="text-nox-textSecondary text-center">Você não possui nenhum Pix agendado.</p>
          </div>
        )}
        
        {activeTab === 'history' && (
          <div className="space-y-4">
            {/* We'd map through real transactions here */}
            <div className="nox-card border border-zinc-800">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-white">Maria Oliveira</h4>
                  <p className="text-sm text-nox-textSecondary">Ontem às 14:30</p>
                </div>
                <div className="text-right">
                  <p className="text-red-500">-R$ 50,00</p>
                  <p className="text-xs text-nox-textSecondary">Enviado</p>
                </div>
              </div>
            </div>
            
            <div className="nox-card border border-zinc-800">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-white">Carlos Santos</h4>
                  <p className="text-sm text-nox-textSecondary">20/05 às 10:15</p>
                </div>
                <div className="text-right">
                  <p className="text-green-500">+R$ 120,00</p>
                  <p className="text-xs text-nox-textSecondary">Recebido</p>
                </div>
              </div>
            </div>
            
            <div className="nox-card border border-zinc-800">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-white">Mercado Express</h4>
                  <p className="text-sm text-nox-textSecondary">18/05 às 17:45</p>
                </div>
                <div className="text-right">
                  <p className="text-red-500">-R$ 32,90</p>
                  <p className="text-xs text-nox-textSecondary">Enviado</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <BottomNav activeTab="home" />
    </div>
  );
};

export default Pix;
