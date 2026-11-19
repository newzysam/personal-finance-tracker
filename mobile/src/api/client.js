import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

export class ApiError extends Error {
  constructor(message, errors) {
    super(message);
    this.errors = errors || {};
  }
}

async function request(path, options = {}) {
  const token = await AsyncStorage.getItem('finance_token');
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers }
  });
  let data;
  try { data = await response.json(); } catch (_err) { data = {}; }
  if (!response.ok) throw new ApiError(data.message || 'Request failed', data.errors);
  return data;
}

export default { request };
