import { useState, useCallback } from 'react';
import repairService from '../services/repairService';

export function useRepairs() {
  const [repairs, setRepairs] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState({ totalCount: 0, totalCost: 0, repairs: [] });
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState('');

  const loadRepairs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await repairService.getRepairs();
      setRepairs(data);
    } catch (err) {
      setError('فشل في تحميل بيانات الإصلاحات');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMonthlyStats = useCallback(async (month, year) => {
    setLoadingStats(true);
    try {
      const stats = await repairService.getMonthlyStats(month, year);
      setMonthlyStats(stats);
    } catch (err) {
      setMonthlyStats({ totalCount: 0, totalCost: 0, repairs: [] });
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const addRepair = useCallback(async (repair) => {
    await repairService.createRepair(repair);
    await loadRepairs();
  }, [loadRepairs]);

  const editRepair = useCallback(async (id, repair) => {
    await repairService.updateRepair(id, repair);
    await loadRepairs();
  }, [loadRepairs]);

  const deleteRepair = useCallback(async (id) => {
    await repairService.deleteRepair(id);
    await loadRepairs();
  }, [loadRepairs]);

  // Mark fixed/not fixed/delivered
  const markFixed = useCallback(async (id) => {
    await repairService.markFixed(id);
    await loadRepairs();
  }, [loadRepairs]);
  const markNotFixed = useCallback(async (id) => {
    await repairService.markNotFixed(id);
    await loadRepairs();
  }, [loadRepairs]);
  const deliver = useCallback(async (id, date) => {
    await repairService.deliver(id, date);
    await loadRepairs();
  }, [loadRepairs]);

  return {
    repairs,
    monthlyStats,
    loading,
    loadingStats,
    error,
    loadRepairs,
    loadMonthlyStats,
    addRepair,
    editRepair,
    deleteRepair,
    markFixed,
    markNotFixed,
    deliver,
    setError,
  };
}
