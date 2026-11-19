import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import DashboardScreen from '../screens/DashboardScreen';
import HistoryScreen from '../screens/HistoryScreen';
import TransactionFormScreen from '../screens/TransactionFormScreen';

const Stack=createNativeStackNavigator();

export default function RootNavigator(){
 const {user,loading}=useAuth(); const {colors,dark}=useTheme();
 if(loading)return <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:colors.background}}><ActivityIndicator size="large" color={colors.primary}/></View>;
 const baseTheme=dark?DarkTheme:DefaultTheme;
 const navigationTheme={...baseTheme,dark,colors:{...baseTheme.colors,primary:colors.primary,background:colors.background,card:colors.surface,text:colors.text,border:colors.border,notification:colors.primary}};
 return <NavigationContainer theme={navigationTheme}><Stack.Navigator screenOptions={{headerStyle:{backgroundColor:colors.surface},headerTintColor:colors.text,headerShadowVisible:false}}>{!user?<><Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}}/><Stack.Screen name="Register" component={RegisterScreen} options={{title:'Create Account'}}/><Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{title:'Password Reset'}}/></>:<><Stack.Screen name="Dashboard" component={DashboardScreen} options={{headerShown:false}}/><Stack.Screen name="History" component={HistoryScreen} options={{title:'Previous Reports'}}/><Stack.Screen name="TransactionForm" component={TransactionFormScreen} options={({route})=>({title:route.params?.transaction?'Edit Report':'Add Report'})}/></>}</Stack.Navigator></NavigationContainer>;
}
