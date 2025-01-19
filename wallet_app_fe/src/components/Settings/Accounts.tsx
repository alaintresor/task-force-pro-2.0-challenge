import { useEffect, useState } from 'react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import axios from 'axios';
const baseUrl = import.meta.env.VITE_BASE_URL;

const Accounts: React.FC = () => {
  const [newAccount, setNewAccount] = useState({ name: '', type: 'cash', balance: 0 });
  const [accounts, setAccounts] = useState<{ _id: number, name: string, type: string, balance: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [editingAccount, setEditingAccount] = useState<{ _id: number, name: string, type: string, balance: number } | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/accounts`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setAccounts(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${baseUrl}/accounts`,
        newAccount,
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setAccounts([...accounts, res.data]);
      setNewAccount({ name: '', type: 'cash', balance: 0 });
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };

  const handleUpdateAccount = async () => {
    if (!editingAccount) return;
    try {
      const res = await axios.put(
        `${baseUrl}/accounts/${editingAccount._id}`,
        editingAccount,
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setAccounts(accounts.map(account => (account._id === res.data._id ? res.data : account)));
      setEditingAccount(null);
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${baseUrl}/accounts/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setAccounts(accounts.filter((account) => account._id !== id));
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">

      <form onSubmit={handleAddAccount} className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Account</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={newAccount.name}
            onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
            placeholder="Account name"
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
          <select
            value={newAccount.type}
            onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="cash">Cash</option>
            <option value="bank">Bank Account</option>
            <option value="momo">Mobile Money</option>
            <option value="credit">Credit Card</option>
          </select>
          <button
            type="submit"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Account
          </button>
        </div>
      </form>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Accounts</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accounts.map((account) => (
                <tr key={account._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{account.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{account.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${account.balance.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingAccount(account)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(account._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Account</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Are you sure you want to delete this account?</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    handleDelete(showDeleteModal);
                    setShowDeleteModal(null);
                  }}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingAccount && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="px-4 py-5">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Account</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editingAccount.name}
                    onChange={(e) => setEditingAccount({ ...editingAccount, name: e.target.value })}
                    placeholder="Account name"
                    className="rounded-md border-gray-300 shadow-sm w-full focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <select
                    value={editingAccount.type}
                    onChange={(e) => setEditingAccount({ ...editingAccount, type: e.target.value })}
                    className="rounded-md border-gray-300 shadow-sm w-full focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="bank">Bank Account</option>
                    <option value="momo">Mobile Money</option>
                    <option value="credit">Credit Card</option>
                  </select>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 flex justify-end">
                <button
                  onClick={handleUpdateAccount}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingAccount(null)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Accounts;