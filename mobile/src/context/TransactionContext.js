import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';

const TransactionContext = createContext();
export function TransactionProvider({ children }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income:0, expenses:0, balance:0 });
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async (filters = {}) => {
    if (!user) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => { if (value) params.set(key, value); });
      const data = await api.request(`/transactions${params.size ? `?${params}` : ''}`);
      setTransactions(data.transactions); setSummary(data.summary);
    } finally { setLoading(false); }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);
  const create = async values => { const data = await api.request('/transactions', { method:'POST', body:JSON.stringify(values) }); await refresh(); return data.transaction; };
  const update = async (id, values) => { const data = await api.request(`/transactions/${id}`, { method:'PUT', body:JSON.stringify(values) }); await refresh(); return data.transaction; };
  const remove = async id => { await api.request(`/transactions/${id}`, { method:'DELETE' }); await refresh(); };
  return <TransactionContext.Provider value={{ transactions, summary, loading, refresh, create, update, remove }}>{children}</TransactionContext.Provider>;
}
export const useTransactions = () => useContext(TransactionContext);
