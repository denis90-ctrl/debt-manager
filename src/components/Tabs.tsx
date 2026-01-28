import { Wallet, TrendingDown, TrendingUp } from 'lucide-react';

export type TabType = 'debts' | 'expenses' | 'income';

interface TabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Tabs = ({ activeTab, onTabChange }: TabsProps) => {
  const tabs = [
    { id: 'debts' as TabType, label: 'Долги', icon: Wallet },
    { id: 'expenses' as TabType, label: 'Расходы', icon: TrendingDown },
    { id: 'income' as TabType, label: 'Доходы', icon: TrendingUp },
  ];

  return (
    <div className="flex gap-2 mb-6 border-b-2 border-gray-200 dark:border-slate-700 pb-0">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-semibold transition-all border-b-4 ${
              isActive
                ? 'text-primary border-primary bg-blue-50 dark:bg-slate-800'
                : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-primary'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

