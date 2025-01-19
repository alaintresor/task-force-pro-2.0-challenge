import  { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '../types';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { CalendarRange } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import axios from "axios";
const baseUrl = import.meta.env.VITE_BASE_URL;

export default function Reports() {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: format(startOfMonth(subMonths(new Date(), 5)), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    fetchMonthlyData();
  }, [dateRange]);

  const fetchMonthlyData = async () => {
    try {
      const transactions = await axios.get(`${baseUrl}/transactions/report?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });

      if (transactions) {
        // Calculate totals
        let incomeTotal = 0;
        let expenseTotal = 0;

        const monthlyTotals = transactions.data.reduce((acc: any, transaction: Transaction) => {
          const month = format(new Date(transaction.date), 'MMM yyyy');
          if (!acc[month]) {
            acc[month] = { income: 0, expense: 0 };
          }
          if (transaction.type === 'income') {
            acc[month].income += transaction.amount;
            incomeTotal += transaction.amount;
          } else {
            acc[month].expense += transaction.amount;
            expenseTotal += transaction.amount;
          }
          return acc;
        }, {});

        setTotalIncome(incomeTotal);
        setTotalExpense(expenseTotal);

        const chartData = Object.entries(monthlyTotals).map(([month, data]: [string, any]) => ({
          month,
          income: data.income,
          expense: data.expense,
          net: data.income - data.expense
        }));

        setMonthlyData(chartData);
      }
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Financial Reports</h2>
        <p className="mt-1 text-sm text-gray-500">Track your income and expenses over time</p>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <CalendarRange className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Date Range</h3>
          </div>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-green-800">Total Income</h4>
            <p className="mt-2 text-2xl font-semibold text-green-600">${totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-red-800">Total Expenses</h4>
            <p className="mt-2 text-2xl font-semibold text-red-600">${totalExpense.toFixed(2)}</p>
          </div>
          <div className={`${totalIncome - totalExpense >= 0 ? 'bg-blue-50' : 'bg-orange-50'} p-4 rounded-lg`}>
            <h4 className={`text-sm font-medium ${totalIncome - totalExpense >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
              Net Balance
            </h4>
            <p className={`mt-2 text-2xl font-semibold ${totalIncome - totalExpense >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              ${(totalIncome - totalExpense).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[300px] sm:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                contentStyle={{ fontSize: '12px' }}
              />
              <Bar dataKey="income" fill="#4F46E5" name="Income" />
              <Bar dataKey="expense" fill="#EF4444" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Summary Table */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Month</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Income</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Expense</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider py-2">Net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {monthlyData.map((data) => (
                <tr key={data.month}>
                  <td className="py-2 text-sm text-gray-900">{data.month}</td>
                  <td className="py-2 text-sm text-right text-green-600">${data.income.toFixed(2)}</td>
                  <td className="py-2 text-sm text-right text-red-600">${data.expense.toFixed(2)}</td>
                  <td className={`py-2 text-sm text-right font-medium ${data.net >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    ${data.net.toFixed(2)}
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