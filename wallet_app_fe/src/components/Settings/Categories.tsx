import { useEffect, useState } from "react";
import { useAuth } from "../../lib/AuthContext";
import { Category, Subcategory } from "../../types";
import { Plus, Trash2 } from "lucide-react";
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

const Categories: React.FC = () => {

    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [newCategory, setNewCategory] = useState<{ name: string; type: 'expense' | 'income' }>({ name: '', type: 'expense' });
    const [newSubcategory, setNewSubcategory] = useState({ name: '', category_id: '' });
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user)
            fetchData();
    }, [user]);


    const fetchData = async () => {
        try {

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

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        try {
            const res = await axios.post(`${baseUrl}/categories`, {
                name: newCategory.name,
                type: newCategory.type
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });
            setCategories([...categories, res.data]);
            setNewCategory({ name: '', type: 'expense' });
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const handleAddSubcategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            const res = await axios.post(`${baseUrl}/subcategories`, {
                name: newSubcategory.name,
                categoryId: newSubcategory.category_id,
            }, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });
            setSubcategories([...subcategories, res.data]);
            setNewSubcategory({ name: '', category_id: '' });
        } catch (error) {
            console.error('Error adding subcategory:', error);
        }
    };

    const handleDelete = async (table: string, id: string) => {
        try {
            switch (table) {
                case 'categories':
                    await axios.delete(`${baseUrl}/categories/${id}`, {
                        headers: {
                            Authorization: `Bearer ${user?.token}`
                        }
                    });
                    setCategories(categories.filter(item => item._id !== id));
                    break;
                case 'subcategories':
                    await axios.delete(`${baseUrl}/subcategories/${id}`, {
                        headers: {
                            Authorization: `Bearer ${user?.token}`
                        }
                    });
                    setSubcategories(subcategories.filter(item => item._id !== id));
                    break;
            }
        } catch (error) {
            console.error(`Error deleting ${table} item:`, error);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Categories Form */}
                <form onSubmit={handleAddCategory} className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Category</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="text"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            placeholder="Category name"
                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                        <select
                            value={newCategory.type}
                            onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value as 'expense' | 'income' })}
                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Category
                    </button>
                </form>

                {/* Subcategories Form */}
                <form onSubmit={handleAddSubcategory} className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Subcategory</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="text"
                            value={newSubcategory.name}
                            onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                            placeholder="Subcategory name"
                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                        <select
                            value={newSubcategory.category_id}
                            onChange={(e) => setNewSubcategory({ ...newSubcategory, category_id: e.target.value })}
                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Subcategory
                    </button>
                </form>
            </div>

            {/* Categories List */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Categories & Subcategories</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategories</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.map((category) => (
                                <tr key={category._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.type === 'income'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {category.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {subcategories
                                            .filter(sub => sub.categoryId._id === category._id)
                                            .map(sub => sub.name)
                                            .join(', ')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete('categories', category._id)}
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
        </div>
    )
}

export default Categories;