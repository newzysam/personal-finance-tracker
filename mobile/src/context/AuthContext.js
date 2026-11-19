import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/client';

const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { const token = await AsyncStorage.getItem('finance_token'); if (token) setUser(await api.request('/auth/me')); }
      catch (_err) { await AsyncStorage.removeItem('finance_token'); }
      finally { setLoading(false); }
    })();
  }, []);

  async function saveSession(data) {
    await AsyncStorage.setItem('finance_token', data.token);
    setUser(data.user);
  }
  const register = async values => saveSession(await api.request('/auth/register', { method:'POST', body:JSON.stringify(values) }));
  const login = async values => saveSession(await api.request('/auth/login', { method:'POST', body:JSON.stringify(values) }));
  const logout = async () => { await AsyncStorage.removeItem('finance_token'); setUser(null); };
  const forgotPassword = email => api.request('/auth/forgot-password', { method:'POST', body:JSON.stringify({ email }) });
  const resetPassword = values => api.request('/auth/reset-password', { method:'POST', body:JSON.stringify(values) });
  return <AuthContext.Provider value={{ user, loading, register, login, logout, forgotPassword, resetPassword }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
