import { useCallback, useEffect, useMemo, useState } from 'react';
import { getDebts as storageGetDebts } from '../utils/storage';
import { usePerformanceTimer } from '../components/PerformanceMonitor';
import { Debt } from '../types/debt';

export const useDebts = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const cache = useMemo(() => new Map<string, Debt>(), []);
  const { startTimer, endTimer } = usePerformanceTimer('loadDebts');

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return debts;
    const q = searchQuery.toLowerCase();
    return debts.filter(d =>
      d.name.toLowerCase().includes(q) || String(d.id).includes(q)
    );
  }, [debts, searchQuery]);

  const loadDebts = useCallback(async (force = false) => {
    try {
      startTimer();
      const now = Date.now();
      const cacheAge = 5 * 60 * 1000; // 5 мин
      if (!force && now - lastFetch < cacheAge && debts.length > 0) {
        endTimer();
        return;
      }

      setLoading(true);
      setError(null);

      const data = storageGetDebts();
      data.forEach((d: Debt) => cache.set(d.id, d));
      setDebts(data);
      setLastFetch(now);
      endTimer();
    } catch (e) {
      console.error('Ошибка загрузки долгов:', e);
      setError('Ошибка загрузки долгов');
      endTimer();
    } finally {
      setLoading(false);
    }
  }, [cache, debts.length, endTimer, lastFetch, startTimer]);

  const updateDebtLocal = useCallback((id: string, updates: Partial<Debt>) => {
    setDebts(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  }, []);

  useEffect(() => {
    loadDebts();
    const interval = setInterval(() => loadDebts(), 30000);
    return () => clearInterval(interval);
  }, [loadDebts]);

  const debouncedSetSearch = useCallback((q: string) => {
    const t = setTimeout(() => setSearchQuery(q), 300);
    return () => clearTimeout(t);
  }, []);

  return {
    debts: filtered,
    loading,
    error,
    loadDebts,
    updateDebtLocal,
    setSearchQuery: debouncedSetSearch,
    searchQuery,
  };
};

export default useDebts;
