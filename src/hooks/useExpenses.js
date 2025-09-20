import { useState, useCallback } from 'react';
import expenseService from '../services/expenseService';

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState({ total: 0, count: 0 });
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState('');

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await expenseService.getExpenses();
      setExpenses(data);
    } catch (err) {
      setError('فشل في تحميل بيانات المصروفات');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMonthlyStats = useCallback(async (month, year) => {
    setLoadingStats(true);
    try {
      const stats = await expenseService.getMonthlyStats(month, year);
      setMonthlyStats({
        total: stats.totalAmount ?? 0,
        count: stats.expensesCount ?? 0,
        expenses: stats.expenses || [],
      });
    } catch (err) {
      setMonthlyStats({ total: 0, count: 0 });
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const addExpense = useCallback(async (expense) => {
    // Accepts { description, amount, expenseDate }
    await expenseService.createExpense(expense.description, expense.amount, expense.expenseDate);
    await loadExpenses();
  }, [loadExpenses]);

  const editExpense = useCallback(async (id, expense) => {
    await expenseService.updateExpense(id, expense);
    await loadExpenses();
  }, [loadExpenses]);

  const deleteExpense = useCallback(async (id) => {
    await expenseService.deleteExpense(id);
    await loadExpenses();
  }, [loadExpenses]);

  return {
    expenses,
    monthlyStats,
    loading,
    loadingStats,
    error,
    loadExpenses,
    loadMonthlyStats,
    addExpense,
    editExpense,
    deleteExpense,
    setError,
  };
}
