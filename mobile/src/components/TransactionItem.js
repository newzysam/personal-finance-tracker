import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { money, dateLabel } from '../utils/format';

export default function TransactionItem({ item, onPress }) {
  const { colors } = useTheme();
  const income = item.type === 'income';
  const tint = income ? colors.income : colors.expense;
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${income?'income':'expense'}, ${money(item.amount)}, ${dateLabel(item.date)}, balance ${money(item.balanceAfter)}. Edit report.`}
      style={{ backgroundColor:colors.surface, borderWidth:1, borderColor:colors.border, borderRadius:16, padding:14, marginBottom:10, flexDirection:'row', alignItems:'center', minHeight:76 }}
    >
      <View style={{ width:44, height:44, borderRadius:15, backgroundColor:income?colors.incomeSurface:colors.expenseSurface, alignItems:'center', justifyContent:'center', marginRight:12 }}>
        <Text style={{ color:tint, fontSize:12, fontWeight:'800' }}>{income?'IN':'OUT'}</Text>
      </View>
      <View style={{ flex:1, minWidth:0 }}>
        <Text numberOfLines={1} style={{ color:colors.text, fontSize:15, fontWeight:'700' }}>{item.name}</Text>
        <Text style={{ color:colors.muted, fontSize:12, marginTop:4 }}>{dateLabel(item.date)} · Balance {money(item.balanceAfter)}</Text>
      </View>
      <View style={{ alignItems:'flex-end', marginLeft:8 }}>
        <Text style={{ color:tint, fontSize:15, fontWeight:'800' }}>{income?'+':'−'}{money(item.amount)}</Text>
        <Text style={{ color:colors.muted, fontSize:12, marginTop:4 }}>{income?'Income':'Expense'}</Text>
      </View>
    </TouchableOpacity>
  );
}
