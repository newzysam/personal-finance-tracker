import React, { createContext, useContext, useMemo, useState } from 'react';
import { Platform, useColorScheme } from 'react-native';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const system = useColorScheme();
  const [preference, setPreference] = useState('system');
  const mode = preference === 'system' ? system : preference;
  const dark = mode === 'dark';
  const colors = useMemo(() => dark ? {
    background:'#0B1220', surface:'#121D2E', surface2:'#1B2A3E', text:'#F8FAFC', muted:'#A7B4C7',
    primary:'#78A9FF', primaryStrong:'#2563EB', border:'#29384D', income:'#34D399', incomeSurface:'#12382F',
    expense:'#FDA4AF', expenseSurface:'#3B202B', warning:'#FBBF24', danger:'#FDA4AF', hero:'#132C50'
  } : {
    background:'#F5F7FA', surface:'#FFFFFF', surface2:'#F1F5F9', text:'#172B4D', muted:'#5C6B80',
    primary:'#2457C5', primaryStrong:'#1D4ED8', border:'#E2E8F0', income:'#087A55', incomeSurface:'#E7F5EF',
    expense:'#BE3A48', expenseSurface:'#FFF0F1', warning:'#B45309', danger:'#BE3A48', hero:'#173B70'
  }, [dark]);
  const typography = useMemo(() => ({
    family: Platform.select({ ios:'System', android:'Roboto', web:'Inter, system-ui, -apple-system, sans-serif' }),
    label: 13,
    body: 15,
    title: 23,
    balance: 36
  }), []);
  return <ThemeContext.Provider value={{ dark, mode, preference, setPreference, colors, typography }}>{children}</ThemeContext.Provider>;
}
export const useTheme = () => useContext(ThemeContext);
