
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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2 px-4 shadow-md">
      <div className="flex items-center justify-around">
        {tabs.map(tab => (
          <Link
            key={tab.value}
            to={tab.path}
            className={cn(
              "flex flex-col items-center py-2 px-4 rounded-xl transition-colors",
              activeTab === tab.value
                ? "text-nox-primary"
                : "text-gray-400 hover:text-gray-700"
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
