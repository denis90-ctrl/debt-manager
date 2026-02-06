import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getDebts as storageGetDebts } from '../utils/storage';
import { Debt } from '../types/debt';

export const useDebts = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const searchDebounceRef = useRef<number | null>(null);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return debts;
    const q = searchQuery.toLowerCase();
    return debts.filter(d =>
      d.name.toLowerCase().includes(q) || String(d.id).includes(q)
    );
  }, [debts, searchQuery]);

  const loadDebts = useCallback(async (force = false) => {
    try {
      const now = Date.now();
      const cacheAge = 5 * 60 * 1000; // 5 мин
      if (!force && now - lastFetch < cacheAge && debts.length > 0) {
        return;
      }

      setLoading(true);
      setError(null);

      const data = storageGetDebts();
      setDebts(data);
      setLastFetch(now);
    } catch (e) {
      console.error('Ошибка загрузки долгов:', e);
      setError('Ошибка загрузки долгов');
    } finally {
      setLoading(false);
    }
  }, [debts.length, lastFetch]);

  const updateDebtLocal = useCallback((id: string, updates: Partial<Debt>) => {
    setDebts(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  }, []);

  useEffect(() => {
    loadDebts();
    return () => {
      if (searchDebounceRef.current) {
        window.clearTimeout(searchDebounceRef.current);
      }
    };
  }, [loadDebts]);

  const debouncedSetSearch = useCallback((q: string) => {
    if (searchDebounceRef.current) {
      window.clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = window.setTimeout(() => {
      setSearchQuery(q);
      searchDebounceRef.current = null;
    }, 300);
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
