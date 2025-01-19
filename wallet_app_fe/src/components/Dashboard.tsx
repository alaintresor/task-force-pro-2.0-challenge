import { useEffect, useState } from 'react';
import { Transaction, Account } from '../types';
import axios from 'axios';
import { useAuth } from '../lib/AuthContext';
const baseUrl = import.meta.env.VITE_BASE_URL;

export default function Dashboard() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [budgetAlerts, setBudgetAlerts] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // Fetch accounts
    const accountsData = await axios.get(`${baseUrl}/accounts`, {
      headers: {
        Authorization: `Bearer ${user?.token}`
      }
    });
    if (accountsData) {
      setAccounts(accountsData.data);
    }

    // Fetch recent transactions
    const transactions = await axios.get(`${baseUrl}/transactions`, {
      headers: {
        Authorization: `Bearer ${user?.token}`
      }
    });
    if (transactions) {
      setRecentTransactions(transactions.data);
    }

    // Check budget alerts
    const budgetsData = await axios.get(`${baseUrl}/budgets`, {
      headers: {
        Authorization: `Bearer ${user?.token}`
      }
    })

    if (budgetsData) {
      // Check if any budget is exceeded
      const alerts = [];
      for (const budget of budgetsData.data) {
        const spentData = await axios.get(`${baseUrl}/transactions/category/${budget.categoryId._id}/report?startDate=${budget.start_date}&endDate=${budget.end_date}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        });
        if (spentData) {
          const totalSpent = spentData.data.reduce((sum: any, t: any) => sum + t.amount, 0);
          if (totalSpent > budget.amount) {
            alerts.push(`Budget exceeded for ${budget.categoryId.name}`);
          }
        }
      }
      setBudgetAlerts(alerts);
    }
  };

  return (
    <div className="space-y-6">
      {/* Accounts Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <div key={account._id} className="bg-white p-4 rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900">{account.name}</h3>
            <p className="mt-2 text-2xl font-semibold text-indigo-600">
              ${account.balance.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">{account.type}</p>
          </div>
        ))}
      </div>

      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-red-800">Budget Alerts</h3>
          <ul className="mt-2 list-disc list-inside">
            {budgetAlerts.map((alert, index) => (
              <li key={index} className="text-red-700">{alert}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Recent Transactions */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {transaction.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}