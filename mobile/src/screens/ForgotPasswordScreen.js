import React, { useState } from 'react';
import { Text } from 'react-native';
import Screen from './Screen';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button, Field } from '../components/ui';

export default function ForgotPasswordScreen({ navigation }) {
 const { forgotPassword, resetPassword }=useAuth(); const {colors}=useTheme();
 const [email,setEmail]=useState(''); const [code,setCode]=useState(''); const [password,setPassword]=useState(''); const [confirmPassword,setConfirmPassword]=useState(''); const [sent,setSent]=useState(false); const [message,setMessage]=useState(''); const [error,setError]=useState('');
 async function request(){setError('');setMessage('');if(!email.trim()){setError('Email is required.');return;}try{const r=await forgotPassword(email.trim());setSent(true);setCode(r.code||'');setMessage(r.code?`${r.message} Your development reset code is shown below.`:r.message);}catch(e){setError(e.message);}}
 async function reset(){setError('');if(!code||!password||!confirmPassword){setError('Enter the reset code and complete both password fields.');return;}if(password.length<8){setError('Password must be at least 8 characters.');return;}if(password!==confirmPassword){setError('Passwords do not match.');return;}try{const r=await resetPassword({email,code,password,confirmPassword});setMessage(r.message);navigation.navigate('Login');}catch(e){setError(e.message);}}
 return <Screen scroll><Text style={{color:colors.text,fontSize:28,fontWeight:'800',marginTop:30,marginBottom:8}}>Reset password</Text><Text style={{color:colors.muted,marginBottom:24}}>Enter your account email to get a reset code.</Text><Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address"/> {!sent?<Button title="Send Reset Code" onPress={request}/>:<><Text style={{color:colors.primary,marginBottom:12}}>{message}</Text><Field label="Reset code" value={code} onChangeText={setCode} keyboardType="number-pad" placeholder="6-digit code"/><Field label="New password" value={password} onChangeText={setPassword} secureTextEntry/><Field label="Confirm new password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry/><Button title="Reset Password" onPress={reset}/></>}<Text style={{color:colors.danger,marginTop:8}}>{error}</Text><Button title="Back to Sign In" secondary onPress={()=>navigation.goBack()} style={{marginTop:16}}/></Screen>;
}
