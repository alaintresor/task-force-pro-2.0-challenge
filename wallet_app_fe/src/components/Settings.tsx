import { useState } from 'react';
import { CreditCard, Tag, PieChart } from 'lucide-react';
import Accounts from './Settings/Accounts';
import Categories from './Settings/Categories';
import Budgets from './Settings/Budgets';

type SettingsTab = 'accounts' | 'categories' | 'budgets';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('accounts');

  const tabs = [
    { id: 'accounts', label: 'Accounts', icon: CreditCard },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'budgets', label: 'Budgets', icon: PieChart },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="mt-1 text-sm text-gray-500">Manage your financial preferences</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`
                  flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {activeTab === 'accounts' && (
        <Accounts />
      )}

      {activeTab === 'categories' && (
        <Categories />
      )}

      {activeTab === 'budgets' && (
        <Budgets />
      )}
    </div>
  );
}