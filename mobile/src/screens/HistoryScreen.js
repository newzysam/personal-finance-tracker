import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Screen from './Screen';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../context/TransactionContext';
import TransactionItem from '../components/TransactionItem';
import { Button, Card } from '../components/ui';

const FILTERS = [
  { label:'All reports', value:'all' },
  { label:'Income', value:'income' },
  { label:'Expenses', value:'expense' }
];

export default function HistoryScreen({ navigation }) {
  const { colors, typography } = useTheme();
  const { transactions } = useTransactions();
  const [filter, setFilter] = useState('all');
  const filtered = useMemo(
    () => filter === 'all' ? transactions : transactions.filter(item => item.type === filter),
    [filter, transactions]
  );

  return (
    <Screen scroll contentStyle={{ paddingTop:22, paddingBottom:28 }}>
      <Text style={{ color:colors.muted, fontSize:13, fontWeight:'600', fontFamily:typography.family }}>YOUR ACTIVITY</Text>
      <Text style={{ color:colors.text, fontSize:26, fontWeight:'800', letterSpacing:-0.6, marginTop:5, fontFamily:typography.family }}>Reports</Text>
      <Text style={{ color:colors.muted, fontSize:14, marginTop:5, marginBottom:18, fontFamily:typography.family }}>
        Review every income and expense in one place.
      </Text>

      <View accessibilityRole="radiogroup" style={{ flexDirection:'row', gap:8, marginBottom:18 }}>
        {FILTERS.map(option => {
          const selected = filter === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setFilter(option.value)}
              style={{ backgroundColor:selected?colors.primaryStrong:colors.surface, borderRadius:22, borderWidth:1, borderColor:selected?colors.primaryStrong:colors.border, paddingVertical:9, paddingHorizontal:14 }}
            >
              <Text style={{ color:selected?'#fff':colors.muted, fontSize:12, fontWeight:'700', fontFamily:typography.family }}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {filtered.map(item => (
        <TransactionItem key={item._id} item={item} onPress={() => navigation.navigate('TransactionForm',{transaction:item})} />
      ))}

      {!filtered.length && (
        <Card style={{ alignItems:'center', padding:24 }}>
          <Text style={{ color:colors.text, fontSize:16, fontWeight:'700', fontFamily:typography.family }}>
            {transactions.length ? 'No reports in this filter' : 'No reports yet'}
          </Text>
          <Text style={{ color:colors.muted, fontSize:13, textAlign:'center', marginTop:6, marginBottom:16, fontFamily:typography.family }}>
            {transactions.length ? 'Choose another filter to see your activity.' : 'Add a report and your balance updates automatically.'}
          </Text>
          {!transactions.length && <Button title="Add your first report" onPress={() => navigation.navigate('TransactionForm')} />}
        </Card>
      )}
    </Screen>
  );
}
