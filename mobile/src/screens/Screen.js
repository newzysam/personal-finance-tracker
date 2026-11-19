import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

export default function Screen({ children, scroll=false, style, contentStyle }) {
  const { colors, dark } = useTheme();
  const containerStyle = [{ width:'100%', maxWidth:760, alignSelf:'center', paddingHorizontal:20, paddingVertical:18, flexGrow:1 }, contentStyle];
  const content = scroll
    ? <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={containerStyle}>{children}</ScrollView>
    : <View style={[{ flex:1 }, containerStyle]}>{children}</View>;
  return <SafeAreaView style={[{ flex:1, backgroundColor:colors.background }, style]}><StatusBar barStyle={dark?'light-content':'dark-content'}/><KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS==='ios'?'padding':undefined}>{content}</KeyboardAvoidingView></SafeAreaView>;
}
