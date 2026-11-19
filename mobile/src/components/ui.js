import React from 'react';
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export function Card({ children, style }) {
  const { colors } = useTheme();
  return <View style={[{ backgroundColor:colors.surface, borderRadius:20, padding:18, borderWidth:1, borderColor:colors.border }, style]}>{children}</View>;
}

export function BrandMark({ compact=false }) {
  const { colors, typography } = useTheme();
  const markWidth = compact ? 52 : 62;
  const markHeight = compact ? 50 : 60;
  return (
    <View accessibilityRole="image" accessibilityLabel="Moni Check logo: a man raises coins in his right hand and keeps his left hand in his pocket, beside a rising money chart" style={{ flexDirection:'row', alignItems:'center', gap:11 }}>
      <View style={{ width:markWidth, height:markHeight, position:'relative' }}>
        <View style={{ position:'absolute', left:2, bottom:7, width:18, height:24, flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between' }}>
          <View style={{ width:4, height:8, borderTopLeftRadius:2, borderTopRightRadius:2, backgroundColor:'#86A9E8' }} />
          <View style={{ width:4, height:14, borderTopLeftRadius:2, borderTopRightRadius:2, backgroundColor:'#4D83D8' }} />
          <View style={{ width:4, height:21, borderTopLeftRadius:2, borderTopRightRadius:2, backgroundColor:colors.income }} />
        </View>
        <View style={{ position:'absolute', left:25, top:7, width:14, height:14, borderRadius:7, backgroundColor:'#F2C6A8', borderWidth:1, borderColor:'#B87555' }} />
        <View style={{ position:'absolute', left:25, top:5, width:13, height:5, borderTopLeftRadius:7, borderTopRightRadius:7, backgroundColor:'#19314F' }} />
        <View style={{ position:'absolute', left:21, top:21, width:23, height:23, borderTopLeftRadius:8, borderTopRightRadius:8, borderBottomLeftRadius:4, borderBottomRightRadius:4, backgroundColor:'#DCEAFE', borderWidth:1, borderColor:'#7596C3' }} />
        <View style={{ position:'absolute', left:27, top:27, width:10, height:8, borderTopWidth:1, borderLeftWidth:1, borderRightWidth:1, borderColor:'#7596C3', borderTopLeftRadius:2, borderTopRightRadius:2 }} />
        <View style={{ position:'absolute', left:19, top:24, width:7, height:15, borderRadius:4, backgroundColor:'#DCEAFE', transform:[{rotate:'22deg'}] }} />
        <View style={{ position:'absolute', left:20, top:33, width:7, height:6, borderRadius:3, backgroundColor:'#F2C6A8', borderWidth:1, borderColor:'#B87555' }} />
        <View style={{ position:'absolute', left:39, top:18, width:6, height:14, borderRadius:3, backgroundColor:'#DCEAFE', transform:[{rotate:'-38deg'}] }} />
        <View style={{ position:'absolute', left:41, top:8, width:6, height:13, borderRadius:3, backgroundColor:'#F2C6A8', borderWidth:1, borderColor:'#B87555', transform:[{rotate:'-24deg'}] }} />
        <View style={{ position:'absolute', left:42, top:5, width:7, height:6, borderRadius:4, backgroundColor:'#F2C6A8', borderWidth:1, borderColor:'#B87555' }} />
        <View style={{ position:'absolute', left:38, top:0, width:9, height:8, borderRadius:5, backgroundColor:'#E8A92E', borderWidth:1.5, borderColor:'#A86C11', alignItems:'center', justifyContent:'center' }}>
          <View style={{ width:3, height:3, borderRadius:2, borderWidth:1, borderColor:'#FFF0B8' }} />
        </View>
        <View style={{ position:'absolute', left:44, top:0, width:9, height:8, borderRadius:5, backgroundColor:'#FFD568', borderWidth:1.5, borderColor:'#A86C11', alignItems:'center', justifyContent:'center' }}>
          <View style={{ width:3, height:3, borderRadius:2, borderWidth:1, borderColor:'#FFF0B8' }} />
        </View>
        <View style={{ position:'absolute', left:25, bottom:2, width:7, height:9, borderRadius:2, backgroundColor:'#BBD1F8' }} />
        <View style={{ position:'absolute', left:35, bottom:2, width:7, height:9, borderRadius:2, backgroundColor:'#BBD1F8' }} />
      </View>
      <Text style={{ color:colors.text, fontSize:compact?20:24, fontWeight:'800', letterSpacing:-0.75, fontFamily:typography.family }}>Moni <Text style={{ color:colors.primaryStrong }}>Check</Text></Text>
    </View>
  );
}

export function Field({ label, error, style, ...props }) {
  const { colors, typography } = useTheme();
  return (
    <View style={[{ marginBottom:16 }, style]}>
      {label ? <Text style={{ color:colors.text, fontSize:13, fontWeight:'700', marginBottom:8, fontFamily:typography.family }}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.muted}
        accessibilityLabel={props.accessibilityLabel || label}
        style={{
          backgroundColor:colors.surface, color:colors.text, borderWidth:1.5,
          borderColor:error ? colors.danger : colors.border, borderRadius:12,
          paddingHorizontal:14, minHeight:50, fontSize:15, fontFamily:typography.family
        }}
        {...props}
      />
      {error ? <Text accessibilityRole="alert" style={{ color:colors.danger, fontSize:12, marginTop:6, fontFamily:typography.family }}>{error}</Text> : null}
    </View>
  );
}

export function Button({ title, onPress, secondary=false, loading=false, disabled=false, danger=false, style }) {
  const { colors, typography } = useTheme();
  return (
    <TouchableOpacity
      disabled={loading || disabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled:loading || disabled }}
      style={[
        {
          minHeight:50, paddingHorizontal:18, borderRadius:13, alignItems:'center', justifyContent:'center',
          backgroundColor:danger ? colors.danger : secondary ? colors.surface : colors.primaryStrong,
          borderWidth:secondary?1:0, borderColor:colors.border, opacity:disabled && !loading ? 0.5 : 1
        },
        style
      ]}
    >
      {loading ? <ActivityIndicator color="#fff"/> : <Text style={{ color:secondary ? colors.text : '#fff', fontWeight:'700', fontSize:15, fontFamily:typography.family }}>{title}</Text>}
    </TouchableOpacity>
  );
}
