import { useEffect, useState } from "react";
import { useAuth } from "../../lib/AuthContext";
import { Budget, Category } from "../../types";
import { Edit, Plus, Trash2 } from "lucide-react";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

const Budgets: React.FC = () => {
    const { user } = useAuth();
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [newBudget, setNewBudget] = useState({
        categoryId: '',
        amount: 0,
        period: 'monthly' as 'monthly' | 'yearly',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);


    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${baseUrl}/budgets`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });
            setBudgets(res.data);

            const categories = await axios.get(`${baseUrl}/categories`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });
            setCategories(categories.data);
        } catch (error) {
            console.error('Error fetching budgets:', error);
        }
        finally {
            setLoading(false)
        }
    };

    const handleAddBudget = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            await axios.post(`${baseUrl}/budgets`, {
                ...newBudget
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            })

            fetchData();
            setNewBudget({
                categoryId: '',
                amount: 0,
                period: 'monthly',
                start_date: new Date().toISOString().split('T')[0],
                end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
            });
        } catch (error) {
            console.error('Error adding budget:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`${baseUrl}/budgets/${id}`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });
            fetchData();
        } catch (error) {
            console.error(`Error deleting budget item:`, error);
        }
    };

    const handleUpdateBudget = async () => {
        try {
            await axios.put(`${baseUrl}/budgets/${editingBudget?._id}`, {
                ...editingBudget
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });
            fetchData();
            setEditingBudget(null);
        } catch (error) {
            console.error('Error updating budget:', error);
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <form onSubmit={handleAddBudget} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Set Budget</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <select
                        value={newBudget.categoryId}
                        onChange={(e) => setNewBudget({ ...newBudget, categoryId: e.target.value })}
                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories
                            .filter(category => category.type === 'expense')
                            .map((category) => (
                                <option key={category._id} value={category._id}>{category.name}</option>
                            ))
                        }
                    </select>
                    <input
                        type="number"
                        value={newBudget.amount}
                        onChange={(e) => setNewBudget({ ...newBudget, amount: parseFloat(e.target.value) })}
                        placeholder="Budget amount"
                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                        step="0.01"
                        min="0"
                    />
                    <select
                        value={newBudget.period}
                        onChange={(e) => setNewBudget({ ...newBudget, period: e.target.value as 'monthly' | 'yearly' })}
                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Set Budget
                    </button>
                </div>
            </form>

            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Limits</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {budgets.map((budget) => {
                                const category = categories.find(c => c._id === budget.categoryId._id);
                                return (
                                    <tr key={budget._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {category?.name || 'Unknown Category'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ${budget.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                            {budget.period}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => setEditingBudget(budget)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-2"
                                            >
                                                <Edit className="h-5 w-5" />
                                            </button>

                                            <button
                                                onClick={() => setShowDeleteModal(budget._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* Edit Modal */}
            {editingBudget && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 text-center">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Budget</h3>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={editingBudget.categoryId.name}

                                        className="rounded-md border-gray-300 shadow-sm w-full focus:border-indigo-500 focus:ring-indigo-500"
                                        disabled
                                    />
                                    <input
                                        type="number"
                                        value={editingBudget.amount}
                                        onChange={(e) => setEditingBudget({ ...editingBudget, amount: parseFloat(e.target.value) })}
                                        placeholder="Amount"
                                        className="rounded-md border-gray-300 shadow-sm w-full focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                        step="0.01"
                                        min="0"
                                    />
                                    <select
                                        value={editingBudget.period}
                                        onChange={(e) => setEditingBudget({ ...editingBudget, period: e.target.value as 'monthly' | 'yearly' })}
                                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 w-full"
                                    >
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={handleUpdateBudget}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditingBudget(null)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Budget</h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">Are you sure you want to delete this Budget?</p>
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
        </div>
    );
}

export default Budgets;