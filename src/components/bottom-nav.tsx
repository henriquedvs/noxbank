
import { Link } from 'react-router-dom';
import { Home, CreditCard, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: 'home' | 'cards' | 'finance' | 'settings';
}

const BottomNav = ({ activeTab }: BottomNavProps) => {
  const tabs = [
    { icon: Home, label: 'Início', value: 'home', path: '/home' },
    { icon: CreditCard, label: 'Cartões', value: 'cards', path: '/cards' },
    { icon: BarChart3, label: 'Finanças', value: 'finance', path: '/finance' },
    { icon: Settings, label: 'Ajustes', value: 'settings', path: '/settings' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-nox-card border-t border-zinc-800 py-2 px-4">
      <div className="flex items-center justify-around">
        {tabs.map(tab => (
          <Link
            key={tab.value}
            to={tab.path}
            className={cn(
              "flex flex-col items-center py-1 px-3 rounded-lg transition-colors",
              activeTab === tab.value
                ? "text-nox-primary"
                : "text-nox-textSecondary hover:text-white"
            )}
          >
            <tab.icon className="h-6 w-6 mb-1" />
            <span className="text-xs">{tab.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
