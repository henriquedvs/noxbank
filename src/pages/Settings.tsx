
import BottomNav from "@/components/bottom-nav";
import { 
  User, Lock, BellDot, CreditCard, HelpCircle, LogOut, 
  ChevronRight, Wallet, Shield, Languages, Smartphone
} from "lucide-react";

const SettingItem = ({ 
  icon: Icon, 
  label, 
  description, 
  onClick 
}: { 
  icon: React.ElementType; 
  label: string; 
  description?: string;
  onClick?: () => void;
}) => {
  return (
    <button 
      onClick={onClick}
      className="flex items-center justify-between w-full p-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/20 transition-colors"
    >
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-nox-primary/10 flex items-center justify-center mr-3">
          <Icon className="h-5 w-5 text-nox-primary" />
        </div>
        <div className="text-left">
          <h4 className="font-medium text-white">{label}</h4>
          {description && <p className="text-xs text-nox-textSecondary">{description}</p>}
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-nox-textSecondary" />
    </button>
  );
};

const Settings = () => {
  return (
    <div className="min-h-screen bg-nox-background pb-20">
      {/* Header */}
      <header className="p-5">
        <h1 className="text-xl font-semibold text-white">Ajustes</h1>
      </header>
      
      {/* Profile */}
      <div className="px-5 mb-6">
        <div className="bg-nox-card rounded-xl p-5 flex items-center">
          <div className="h-16 w-16 rounded-full bg-nox-primary/20 flex items-center justify-center mr-4 text-2xl font-bold text-nox-primary">
            JS
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">João Silva</h3>
            <p className="text-nox-textSecondary">joao.silva@email.com</p>
          </div>
        </div>
      </div>
      
      {/* Settings Groups */}
      <div className="px-5 space-y-6">
        {/* Account Settings */}
        <div className="bg-nox-card rounded-xl overflow-hidden">
          <h3 className="text-md font-semibold text-nox-textSecondary p-4 border-b border-zinc-800">
            Conta
          </h3>
          <div>
            <SettingItem icon={User} label="Dados pessoais" description="Nome, e-mail, telefone, endereço" />
            <SettingItem icon={Lock} label="Segurança" description="Senha, biometria, 2FA" />
            <SettingItem icon={BellDot} label="Notificações" description="Alertas, mensagens, atualizações" />
            <SettingItem icon={Wallet} label="Dados bancários" description="Pix, contas vinculadas" />
          </div>
        </div>
        
        {/* App Settings */}
        <div className="bg-nox-card rounded-xl overflow-hidden">
          <h3 className="text-md font-semibold text-nox-textSecondary p-4 border-b border-zinc-800">
            Aplicativo
          </h3>
          <div>
            <SettingItem icon={Languages} label="Idioma" description="Português (Brasil)" />
            <SettingItem icon={Smartphone} label="Aparência" description="Tema escuro, tamanho da fonte" />
          </div>
        </div>
        
        {/* Support */}
        <div className="bg-nox-card rounded-xl overflow-hidden">
          <h3 className="text-md font-semibold text-nox-textSecondary p-4 border-b border-zinc-800">
            Suporte
          </h3>
          <div>
            <SettingItem icon={HelpCircle} label="Ajuda" description="Perguntas frequentes, suporte" />
            <SettingItem icon={Shield} label="Termos e Privacidade" description="Políticas do aplicativo" />
          </div>
        </div>
        
        {/* Logout */}
        <button className="w-full bg-nox-card rounded-xl p-4 flex items-center justify-center text-rose-500 font-medium">
          <LogOut className="h-5 w-5 mr-2" />
          Sair da conta
        </button>
      </div>
      
      <BottomNav activeTab="settings" />
    </div>
  );
};

export default Settings;
