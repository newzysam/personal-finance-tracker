import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { TransactionProvider } from './src/context/TransactionContext';
import RootNavigator from './src/navigation/RootNavigator';

function AppProviders(){
 const { user } = useAuth();
 return user
  ? <TransactionProvider><RootNavigator /></TransactionProvider>
  : <RootNavigator />;
}

export default function App(){
 return <SafeAreaProvider><ThemeProvider><AuthProvider><AppProviders/></AuthProvider></ThemeProvider></SafeAreaProvider>;
}
