
import { ArrowUpRight, Banknote, CreditCard, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickAction = ({ 
  icon: Icon, 
  label, 
  onClick 
}: { 
  icon: React.ElementType; 
  label: string; 
  onClick?: () => void;
}) => {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center p-3 bg-nox-card rounded-xl border border-zinc-800 hover:border-nox-primary/50 transition-all"
    >
      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-nox-primary/20 to-nox-primary/10 flex items-center justify-center mb-2">
        <Icon className="h-6 w-6 text-nox-primary" />
      </div>
      <span className="text-sm text-white">{label}</span>
    </button>
  );
};

const QuickActions = () => {
  const navigate = useNavigate();
  
  const actions = [
    { 
      icon: ArrowUpRight, 
      label: 'Transferir',
      onClick: () => navigate('/transfer')
    },
    { 
      icon: Banknote, 
      label: 'Pagar',
      onClick: () => navigate('/payment')
    },
    { 
      icon: CreditCard, 
      label: 'Depositar',
      onClick: () => navigate('/deposit')
    },
    { 
      icon: QrCode, 
      label: 'Pix',
      onClick: () => navigate('/pix')
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 px-5 py-5">
      {actions.map((action, index) => (
        <QuickAction
          key={index}
          icon={action.icon}
          label={action.label}
          onClick={action.onClick}
        />
      ))}
    </div>
  );
};

export default QuickActions;
