import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Receipt, DollarSign, Calendar, Eye } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import expenseService from '../services/expenseService';

const ExpensesManager = () => {
  const [modalType, setModalType] = useState(null); // add | edit | view | null
  const [editingExpense, setEditingExpense] = useState(null);
  const [expenseById, setExpenseById] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // إحصائيات
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyStats, setMonthlyStats] = useState({ total: 0, count: 0 });
  const [monthlyExpensesList, setMonthlyExpensesList] = useState([]);

  // Load data
  useEffect(() => {
    loadMonthlyStats(selectedMonth, selectedYear);
    loadMonthlyExpenses(selectedMonth, selectedYear);
    loadExpenses();
  }, [selectedMonth, selectedYear, modalType]);

  const loadMonthlyStats = async (month, year) => {
    try {
      const stats = await expenseService.getMonthlyStats(month, year);
      setMonthlyStats({
        total: stats.totalAmount ?? 0,
        count: stats.expensesCount ?? 0
      });
    } catch {
      setMonthlyStats({ total: 0, count: 0 });
    }
  };

  const loadMonthlyExpenses = async (month, year) => {
    try {
      const all = await expenseService.getExpenses();
      const filtered = all.filter(e => {
        const d = new Date(e.expenseDate || e.date);
        return d.getMonth() + 1 === month && d.getFullYear() === year;
      });
      setMonthlyExpensesList(filtered);
    } catch {
      setMonthlyExpensesList([]);
    }
  };

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await expenseService.getExpenses();
      setExpenses(data);
    } catch (error) {
      setError('فشل في تحميل المصروفات');
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExpenses = monthlyExpensesList;
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // CRUD
  const handleAddExpense = async (expenseData) => {
    try {
      await expenseService.createExpense(
        expenseData.description,
        parseFloat(expenseData.amount),
        expenseData.date
      );
      await loadExpenses();
      setModalType(null);
    } catch (error) {
      setError('فشل في إضافة المصروف');
    }
  };

  const handleEditExpense = async (expenseData) => {
    try {
      await expenseService.updateExpense(editingExpense.id, {
        description: expenseData.description,
        amount: parseFloat(expenseData.amount),
        expenseDate: expenseData.date
      });
      await loadExpenses();
      setModalType(null);
      setEditingExpense(null);
    } catch {
      setError('فشل في تحديث المصروف');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المصروف؟')) {
      try {
        await expenseService.deleteExpense(expenseId);
        await loadExpenses();
      } catch {
        setError('فشل في حذف المصروف');
      }
    }
  };

  const openViewModal = async (expenseId) => {
    setModalType('view');
    setExpenseById(null);
    try {
      const data = await expenseService.getExpenseById(expenseId);
      setExpenseById(data);
    } catch {
      setExpenseById({ error: 'فشل في تحميل تفاصيل المصروف' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إدارة المصروفات</h2>
          <p className="text-gray-600 mt-1">تسجيل ومتابعة المصروفات</p>
        </div>
        <Button onClick={() => setModalType('add')}>
          <Plus className="w-4 h-4" />
          إضافة مصروف جديد
        </Button>
      </div>

      {/* Statistics */}
      <div className="flex gap-2 items-center mb-4">
        <label>الشهر:</label>
        <select
          className="border rounded px-2 py-1 focus:ring focus:ring-blue-400"
          value={selectedMonth}
          onChange={e => setSelectedMonth(Number(e.target.value))}
        >
          {[...Array(12)].map((_, i) => (
            <option key={i+1} value={i+1}>{i+1}</option>
          ))}
        </select>
        <label>السنة:</label>
        <select
          className="border rounded px-2 py-1 focus:ring focus:ring-blue-400"
          value={selectedYear}
          onChange={e => setSelectedYear(Number(e.target.value))}
        >
          {[...Array(5)].map((_, i) => {
            const year = new Date().getFullYear() - 2 + i;
            return <option key={year} value={year}>{year}</option>;
          })}
        </select>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي المصروفات</p>
              <p className="text-2xl font-bold text-gray-900">{totalExpenses.toLocaleString()} جنيه</p>
            </div>
            <DollarSign className="w-8 h-8 text-red-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">مصروفات الشهر</p>
              <p className="text-2xl font-bold text-gray-900">{monthlyStats.total.toLocaleString()} جنيه</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">عدد المصروفات</p>
              <p className="text-2xl font-bold text-gray-900">{monthlyStats.count}</p>
            </div>
            <Receipt className="w-8 h-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="البحث عن مصروف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </Card>

      {/* Expenses List */}
      <Card padding="none">
        <div className="overflow-x-auto max-h-96 table-container">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">الوصف</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">المبلغ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">التاريخ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{expense.description}</td>
                  <td className="px-6 py-4 text-red-600">{expense.amount.toLocaleString()} جنيه</td>
                  <td className="px-6 py-4">{expense.date}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openViewModal(expense.id)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setEditingExpense(expense); setModalType('edit'); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDeleteExpense(expense.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredExpenses.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium">لا توجد مصروفات</h3>
            <p className="text-gray-500">ابدأ بتسجيل مصروف جديد</p>
          </div>
        )}
      </Card>

      {/* Modal */}
      <Modal
        isOpen={!!modalType}
        onClose={() => { setModalType(null); setEditingExpense(null); }}
        title={
          modalType === 'add' ? 'إضافة مصروف جديد' :
          modalType === 'edit' ? 'تعديل المصروف' :
          modalType === 'view' ? 'تفاصيل المصروف' : ''
        }
      >
        {modalType === 'add' && <ExpenseForm onSubmit={handleAddExpense} />}
        {modalType === 'edit' && editingExpense && (
          <ExpenseForm onSubmit={handleEditExpense} initialData={editingExpense} />
        )}
        {modalType === 'view' && (
          expenseById === null ? <div className="text-center">جاري التحميل...</div> :
          expenseById.error ? <div className="text-center text-red-600">{expenseById.error}</div> :
          <div className="space-y-2">
            <div><b>الوصف:</b> {expenseById.description}</div>
            <div><b>المبلغ:</b> {expenseById.amount?.toLocaleString()} جنيه</div>
            <div><b>التاريخ:</b> {expenseById.expenseDate}</div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// Expense Form
const ExpenseForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    description: initialData.description || '',
    amount: initialData.amount || '',
    date: initialData.expenseDate || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="وصف المصروف"
        required
        className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-400"
      />
      <input
        type="number"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        placeholder="المبلغ"
        required
        className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-400"
      />
      <input
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        required
        className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-400"
      />
      <div className="flex justify-end gap-2">
        <Button type="submit" variant="success">حفظ</Button>
      </div>
    </form>
  );
};

export default ExpensesManager;
