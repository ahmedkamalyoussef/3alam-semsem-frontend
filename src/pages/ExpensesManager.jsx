import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Receipt, DollarSign, Calendar } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import expenseService from '../services/expenseService';

const ExpensesManager = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  // حذف الفئة لأن الـ API لا يدعمها

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load expenses on component mount
  useEffect(() => {
    loadExpenses();
  }, []);

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

  // لا يوجد فئات في الـ API

  const filteredExpenses = expenses.filter(expense => {
    return expense.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  // لا يوجد نوع في الـ API، فقط نجمع الكل
  const monthlyExpenses = totalExpenses;

  const handleAddExpense = async (expenseData) => {
    try {
      await expenseService.createExpense(
        expenseData.description,
        parseFloat(expenseData.amount),
        expenseData.date
      );
      await loadExpenses(); // Reload expenses
      setIsAddModalOpen(false);
    } catch (error) {
      setError('فشل في إضافة المصروف');
      console.error('Error adding expense:', error);
    }
  };

  const handleEditExpense = async (expenseData) => {
    try {
      await expenseService.updateExpense(editingExpense.id, {
        description: expenseData.description,
        amount: parseFloat(expenseData.amount),
        expenseDate: expenseData.date
      });
      await loadExpenses(); // Reload expenses
      setIsEditModalOpen(false);
      setEditingExpense(null);
    } catch (error) {
      setError('فشل في تحديث المصروف');
      console.error('Error updating expense:', error);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المصروف؟')) {
      try {
        await expenseService.deleteExpense(expenseId);
        await loadExpenses(); // Reload expenses
      } catch (error) {
        setError('فشل في حذف المصروف');
        console.error('Error deleting expense:', error);
      }
    }
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إدارة المصروفات</h2>
          <p className="text-gray-600 mt-1">تسجيل ومتابعة المصروفات</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4" />
          إضافة مصروف جديد
        </Button>
      </div>

      {/* Statistics */}
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
              <p className="text-sm text-gray-600">المصروفات الشهرية</p>
              <p className="text-2xl font-bold text-gray-900">{monthlyExpenses.toLocaleString()} جنيه</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">عدد المصروفات</p>
              <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
            </div>
            <Receipt className="w-8 h-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
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
          </div>
          {/* لا يوجد فلاتر فئة */}
        </div>
      </Card>

      {/* Expenses List */}
      <Card padding="none">
        <div className="overflow-x-auto max-h-96 table-container">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الوصف</th>
                {/* حذف الفئة */}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المبلغ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{expense.description}</div>
                      <div className="text-sm text-gray-500">{new Date(expense.createdAt).toLocaleString('ar-SA')}</div>
                    </div>
                  </td>
                  {/* حذف الفئة */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                    {expense.amount.toLocaleString()} جنيه
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditModal(expense)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDeleteExpense(expense.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredExpenses.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مصروفات</h3>
            <p className="text-gray-500">ابدأ بتسجيل مصروف جديد</p>
          </div>
        )}
      </Card>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="إضافة مصروف جديد"
      >
  <ExpenseForm onSubmit={handleAddExpense} />
      </Modal>

      {/* Edit Expense Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingExpense(null);
        }}
        title="تعديل المصروف"
      >
        {editingExpense && (
          <ExpenseForm 
            onSubmit={handleEditExpense} 
            initialData={editingExpense}
          />
        )}
      </Modal>
    </div>
  );
};

// Expense Form Component
const ExpenseForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    description: initialData.description || '',
    amount: initialData.amount || '',
    date: initialData.expenseDate || initialData.date || new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">وصف المصروف</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="أدخل وصف المصروف"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ (جنيه)</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
            min="0"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary">إلغاء</Button>
        <Button type="submit" variant="success">حفظ المصروف</Button>
      </div>
    </form>
  );
};

export default ExpensesManager;
