
import { useState } from "react";
import { Barcode, Calendar, Camera, Lock } from "lucide-react";
import BottomNav from "@/components/bottom-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const Payment = () => {
  const [barcodeValue, setBarcodeValue] = useState("");
  
  const handleScanBarcode = () => {
    // In a real app, this would open the device camera to scan
    toast({
      title: "Câmera iniciada",
      description: "Esta funcionalidade usaria a câmera do dispositivo para escanear o código de barras."
    });
  };
  
  const validateBarcode = () => {
    if (!barcodeValue || barcodeValue.length < 10) {
      toast({
        title: "Código inválido",
        description: "Por favor, insira um código de barras válido.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would validate the barcode and fetch bill details
    toast({
      title: "Código validado!",
      description: "Detalhes do boleto carregados."
    });
    
    // Simulate loading bill details
    setTimeout(() => {
      setBillDetails({
        recipient: "Empresa de Energia XPTO",
        value: "R$ 127,35",
        dueDate: "25/05/2025",
        barcode: barcodeValue
      });
    }, 1000);
  };
  
  const [billDetails, setBillDetails] = useState<{
    recipient: string;
    value: string;
    dueDate: string;
    barcode: string;
  } | null>(null);
  
  return (
    <div className="min-h-screen bg-nox-background pb-20">
      {/* Header */}
      <header className="p-5">
        <h1 className="text-xl font-semibold text-white">Pagamento</h1>
        <p className="text-nox-textSecondary mt-1">Contas e boletos</p>
      </header>
      
      <div className="p-5 space-y-6">
        {/* Barcode Input */}
        <div className="nox-card border border-zinc-800">
          <h3 className="text-lg font-medium text-white mb-4">Código de barras</h3>
          
          <div className="space-y-4">
            <div className="flex">
              <Input
                value={barcodeValue}
                onChange={(e) => setBarcodeValue(e.target.value)}
                placeholder="Digite o código de barras"
                className="flex-1 nox-input"
              />
              <Button
                onClick={handleScanBarcode}
                variant="outline"
                className="ml-2 border-zinc-700"
              >
                <Camera className="h-5 w-5" />
              </Button>
            </div>
            
            <Button 
              onClick={validateBarcode} 
              className="w-full nox-button-primary"
              disabled={!barcodeValue}
            >
              Validar código
            </Button>
          </div>
        </div>
        
        {/* Bill Details */}
        {billDetails && (
          <div className="nox-card border border-zinc-800">
            <h3 className="text-lg font-medium text-white mb-4">Detalhes do boleto</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-nox-textSecondary">Beneficiário</span>
                <span className="text-white font-medium">{billDetails.recipient}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-nox-textSecondary">Valor</span>
                <span className="text-white font-medium">{billDetails.value}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-nox-textSecondary">Vencimento</span>
                <span className="text-white font-medium">{billDetails.dueDate}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button className="w-full nox-button-primary">
                <Lock className="h-4 w-4 mr-2" />
                Pagar agora
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-zinc-700 text-white hover:bg-zinc-800"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Agendar pagamento
              </Button>
            </div>
          </div>
        )}
        
        {/* Recent Payments */}
        <div className="nox-card border border-zinc-800">
          <h3 className="text-lg font-medium text-white mb-4">Pagamentos recentes</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-white">Conta de Luz</h4>
                <p className="text-sm text-nox-textSecondary">10/04/2025</p>
              </div>
              <p className="text-red-500">R$ 142,55</p>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-white">Conta de Água</h4>
                <p className="text-sm text-nox-textSecondary">05/04/2025</p>
              </div>
              <p className="text-red-500">R$ 87,90</p>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-white">Internet</h4>
                <p className="text-sm text-nox-textSecondary">01/04/2025</p>
              </div>
              <p className="text-red-500">R$ 99,99</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full mt-4 text-nox-primary hover:bg-nox-primary/10"
          >
            Ver histórico completo
          </Button>
        </div>
      </div>
      
      <BottomNav activeTab="home" />
    </div>
  );
};

export default Payment;
