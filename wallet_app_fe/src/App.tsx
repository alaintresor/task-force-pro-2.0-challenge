import { useState } from 'react';
import { Wallet, PieChart, BarChart3, Settings as SettingsIcon, LogOut, Menu, X } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Auth from './components/Auth';
import { useAuth } from './lib/AuthContext';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Wallet },
    { id: 'transactions', label: 'Transactions', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Wallet className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">WalletApp</span>
              </div>
            </div>
            <div className="hidden md:flex items-center">
              <span className="text-sm text-gray-500 mr-4">{user.username}</span>
              <button
                onClick={() => signOut()}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </button>
            </div>
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-2 text-left ${activeTab === tab.id
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="px-4">
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
                <div className="mt-3 space-y-1">
                  <button
                    onClick={() => signOut()}
                    className="w-full flex items-center px-4 py-2 text-left text-gray-600 hover:bg-gray-50"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="hidden md:flex space-x-4 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg ${activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <main className="bg-white rounded-lg shadow p-4 sm:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;