import React, { useEffect, useState } from 'react';
import { Transaction, Category, Account, Subcategory } from '../types';
import { Plus, X } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { format } from 'date-fns';
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const [error, setError] = useState('');

  // New transaction form state
  const [newTransaction, setNewTransaction] = useState({
    accountId: '',
    categoryId: '',
    subCategoryId: '',
    amount: '',  // Changed from 0 to empty string to avoid NaN warning
    type: 'expense' as const,
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const transactions = await axios.get(`${baseUrl}/transactions`, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      setTransactions(transactions.data);
      const accounts = await axios.get(`${baseUrl}/accounts`, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      setAccounts(accounts.data);

      const res = await axios.get(`${baseUrl}/categories`, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      setCategories(res.data);

      const subRes = await axios.get(`${baseUrl}/subcategories`, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      setSubcategories(subRes.data);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      // Get the selected category to determine transaction type
      const selectedCategory = categories.find(c => c._id === newTransaction.categoryId);
      if (!selectedCategory) return;

      const amount = parseFloat(newTransaction.amount);
      if (isNaN(amount)) return;

      const res = await axios.post(`${baseUrl}/transactions`, {
        ...newTransaction,
        subCategoryId: newTransaction.subCategoryId != "" ? newTransaction.subCategoryId : undefined,
        amount,
        type: selectedCategory.type,
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });


      if (res) {

        await fetchData(); // Refresh all data
        setShowForm(false);
        setNewTransaction({
          accountId: '',
          categoryId: '',
          subCategoryId: '',
          amount: '',  // Reset to empty string
          type: 'expense',
          description: '',
          date: new Date().toISOString().split('T')[0],
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Error adding transaction:', error);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow valid numeric input
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setNewTransaction({ ...newTransaction, amount: value });
    }
  };

  const getAvailableSubcategories = () => {
    return subcategories.filter(sub => sub.categoryId._id === newTransaction.categoryId);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
          <p className="mt-1 text-sm text-gray-500">Manage your financial transactions</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Transaction
        </button>
      </div>

      {/* Add Transaction Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Transaction</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-4">
                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm text-red-700">{error}</div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Account</label>
                    <select
                      value={newTransaction.accountId}
                      onChange={(e) => setNewTransaction({ ...newTransaction, accountId: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select Account</option>
                      {accounts.map((account) => (
                        <option key={account._id} value={account._id}>
                          {account.name} (${account.balance.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={newTransaction.categoryId}
                      onChange={(e) => setNewTransaction({
                        ...newTransaction,
                        categoryId: e.target.value,
                        subCategoryId: '',
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name} ({category.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                    <select
                      value={newTransaction.subCategoryId}
                      onChange={(e) => setNewTransaction({ ...newTransaction, subCategoryId: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">Select Subcategory (Optional)</option>
                      {getAvailableSubcategories().map((subcategory) => (
                        <option key={subcategory._id} value={subcategory._id}>
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <input
                      type="text"  // Changed from number to text for better control
                      value={newTransaction.amount}
                      onChange={handleAmountChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                      placeholder="0.00"
                      pattern="^\d*\.?\d*$"  // Only allow numbers and decimal point
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      value={newTransaction.date}
                      onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <input
                      type="text"
                      value={newTransaction.description}
                      onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Transaction description"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    Save Transaction
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Transactions List */}
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
                  Account
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sub-Category
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
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(transaction.date), 'MMM d, yyyy h:mm a')}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(transaction as any).accountId?.name}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(transaction as any).categoryId?.name}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(transaction as any).subCategoryId?.name}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${transaction.amount.toFixed(2)}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.type === 'income'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
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
  );
}