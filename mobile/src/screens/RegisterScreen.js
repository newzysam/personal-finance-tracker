import React, { useState } from 'react';
import { Text } from 'react-native';
import Screen from './Screen';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { BrandMark, Button, Field } from '../components/ui';

export default function RegisterScreen({ navigation }) {
  const { register }=useAuth(); const { colors }=useTheme();
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [confirmPassword,setConfirmPassword]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  async function submit(){
    setError('');
    if(!name.trim()||!email.trim()||!password||!confirmPassword){setError('Please complete every field.');return;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())){setError('Enter a valid email address.');return;}
    if(password.length<8){setError('Password must be at least 8 characters.');return;}
    if(password!==confirmPassword){setError('Passwords do not match.');return;}
    setLoading(true);try{await register({name,email,password,confirmPassword});}catch(e){setError(e.message);}finally{setLoading(false);}
  }
  return <Screen scroll><BrandMark compact/><Text style={{color:colors.text,fontSize:28,fontWeight:'800',letterSpacing:-0.6,marginTop:28,marginBottom:8}}>Create your account</Text><Text style={{color:colors.muted,fontSize:14,lineHeight:21,marginBottom:24}}>Your personal finance space, private from the start.</Text><Field label="Full name" value={name} onChangeText={setName} autoCapitalize="words"/><Field label="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email"/><Field label="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="new-password"/><Field label="Confirm password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry autoComplete="new-password"/><Text accessibilityRole="alert" style={{color:colors.danger,marginBottom:10}}>{error}</Text><Button title="Create account" onPress={submit} loading={loading}/><Button title="Back to sign in" secondary onPress={()=>navigation.goBack()} style={{marginTop:12}}/></Screen>;
}
