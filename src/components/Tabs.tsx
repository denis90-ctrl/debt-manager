
export type TabType = 'debts' | 'expenses' | 'income';

interface TabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Tabs = ({ activeTab, onTabChange }: TabsProps) => {
  const tabs = [
    { id: 'debts' as TabType, label: 'Долги', icon: '💳' },
    { id: 'expenses' as TabType, label: 'Расходы', icon: '📉' },
    { id: 'income' as TabType, label: 'Доходы', icon: '📈' },
  ];

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

