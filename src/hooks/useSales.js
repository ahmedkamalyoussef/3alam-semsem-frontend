import { useState, useCallback } from 'react';
import saleService from '../services/saleService';

export function useSales() {
  const [sales, setSales] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState('');

  const loadSales = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await saleService.getSales();
      setSales(data);
    } catch (err) {
      setError('فشل في تحميل بيانات المبيعات');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMonthlyStats = useCallback(async (month, year) => {
    setLoadingStats(true);
    try {
      const stats = await saleService.getMonthlyStats(month, year);
      setMonthlyStats(stats);
    } catch (err) {
      setMonthlyStats(null);
    } finally {
      setLoadingStats(false);
    }
  }, []);


  const addSale = useCallback(async (items, month, year) => {
    await saleService.createSale(items);
    await loadSales();
    if (month && year) await loadMonthlyStats(month, year);
  }, [loadSales, loadMonthlyStats]);


  const deleteSale = useCallback(async (saleId, month, year) => {
    await saleService.deleteSale(saleId);
    await loadSales();
    if (month && year) await loadMonthlyStats(month, year);
  }, [loadSales, loadMonthlyStats]);

  return {
    sales,
    monthlyStats,
    loading,
    loadingStats,
    error,
    loadSales,
    loadMonthlyStats,
    addSale,
    deleteSale,
    setError,
  };
}
