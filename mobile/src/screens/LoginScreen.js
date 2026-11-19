import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity } from 'react-native';
import Screen from './Screen';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { BrandMark, Button, Field } from '../components/ui';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth(); const { colors } = useTheme();
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  async function submit(){ setError(''); if(!email.trim()||!password){setError('Email and password are required.');return;} setLoading(true); try{await login({email,password});}catch(e){setError(e.message);}finally{setLoading(false);} }
  return <Screen scroll contentStyle={{ justifyContent:'center', paddingVertical:32 }}><BrandMark/><View style={{height:32}}/><Text style={{color:colors.text,fontSize:30,fontWeight:'800',letterSpacing:-0.7,marginBottom:8}}>Welcome back</Text><Text style={{color:colors.muted,fontSize:15,lineHeight:22,marginBottom:28}}>A clearer view of your money starts here.</Text><Field label="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email"/><Field label="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="current-password"/><Text accessibilityRole="alert" style={{color:colors.danger,marginBottom:10}}>{error}</Text><Button title="Sign in" onPress={submit} loading={loading}/><TouchableOpacity accessibilityRole="button" onPress={()=>navigation.navigate('ForgotPassword')} style={{marginTop:20,alignItems:'center',padding:8}}><Text style={{color:colors.primary,fontWeight:'600'}}>Forgot password?</Text></TouchableOpacity><View style={{height:1,backgroundColor:colors.border,marginTop:14,marginBottom:16}}/><TouchableOpacity accessibilityRole="button" onPress={()=>navigation.navigate('Register')} style={{alignItems:'center',padding:8}}><Text style={{color:colors.text}}>New to Moni Check? <Text style={{color:colors.primary,fontWeight:'700'}}>Create an account</Text></Text></TouchableOpacity></Screen>;
}
