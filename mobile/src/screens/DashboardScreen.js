import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Screen from './Screen';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../context/TransactionContext';
import { useAuth } from '../context/AuthContext';
import { BrandMark, Button, Card } from '../components/ui';
import TransactionItem from '../components/TransactionItem';
import { money } from '../utils/format';

function MetricCard({ label, value, kind, colors, typography }) {
  const isIncome = kind === 'income';
  const tint = isIncome ? colors.income : colors.expense;
  return (
    <Card style={{ flex:1, padding:16 }}>
      <View style={{ flexDirection:'row', alignItems:'center', gap:8 }}>
        <View style={{ width:28, height:28, borderRadius:10, backgroundColor:isIncome?colors.incomeSurface:colors.expenseSurface, alignItems:'center', justifyContent:'center' }}>
          <Text style={{ color:tint, fontWeight:'800' }}>{isIncome?'↗':'↘'}</Text>
        </View>
        <Text style={{ color:colors.muted, fontSize:12, fontWeight:'600', fontFamily:typography.family }}>{label}</Text>
      </View>
      <Text numberOfLines={1} adjustsFontSizeToFit style={{ color:tint, fontSize:18, fontWeight:'800', marginTop:13, fontFamily:typography.family }}>
        {isIncome?'+':'−'}{money(value)}
      </Text>
    </Card>
  );
}

export default function DashboardScreen({ navigation }) {
  const { colors, typography, preference, setPreference, dark } = useTheme();
  const { summary, transactions, loading } = useTransactions();
  const { user, logout } = useAuth();

  return (
    <Screen scroll contentStyle={{ paddingTop:14, paddingBottom:28 }}>
      <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <BrandMark compact />
        <View style={{ flexDirection:'row', alignItems:'center', gap:6 }}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={dark?'Switch to light mode':'Switch to dark mode'}
            onPress={() => setPreference(dark?'light':'dark')}
            style={{ width:42, height:42, alignItems:'center', justifyContent:'center', borderRadius:14, backgroundColor:colors.surface, borderWidth:1, borderColor:colors.border }}
          >
            <Text style={{ color:colors.text, fontSize:18 }}>{dark?'☀':'◐'}</Text>
          </TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" onPress={logout} style={{ padding:10 }}>
            <Text style={{ color:colors.primary, fontSize:13, fontWeight:'700', fontFamily:typography.family }}>Sign out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={{ color:colors.muted, fontSize:14, fontFamily:typography.family }}>Good day, {user?.name?.split(' ')[0] || 'there'}</Text>
      <Text style={{ color:colors.text, fontSize:typography.title, fontWeight:'800', letterSpacing:-0.5, marginTop:4, marginBottom:16, fontFamily:typography.family }}>
        Your money, at a glance
      </Text>

      <View style={{ backgroundColor:colors.hero, borderRadius:24, padding:22, marginBottom:14, overflow:'hidden', minHeight:166, justifyContent:'center' }}>
        <View pointerEvents="none" style={{ position:'absolute', width:150, height:150, borderRadius:75, right:-65, top:-60, backgroundColor:'rgba(255,255,255,0.055)' }} />
        <View pointerEvents="none" style={{ position:'absolute', width:92, height:92, borderRadius:46, right:-25, top:-31, borderWidth:1, borderColor:'rgba(255,255,255,0.1)' }} />
        <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}>
          <Text style={{ color:'#D5E4FA', fontSize:13, fontWeight:'600', fontFamily:typography.family }}>CURRENT BALANCE</Text>
          <View style={{ backgroundColor:'rgba(255,255,255,0.14)', paddingHorizontal:11, paddingVertical:7, borderRadius:20 }}>
            <Text style={{ color:'#E8F0FF', fontSize:12, fontWeight:'700', fontFamily:typography.family }}>ALL TIME</Text>
          </View>
        </View>
        <Text numberOfLines={1} adjustsFontSizeToFit style={{ color:'#FFFFFF', fontSize:typography.balance, fontWeight:'800', letterSpacing:-1, marginTop:12, fontFamily:typography.family }}>
          {money(summary.balance)}
        </Text>
        <Text style={{ color:'#D5E4FA', fontSize:12, marginTop:5, fontFamily:typography.family }}>Income minus expenses</Text>
      </View>

      <View style={{ flexDirection:'row', gap:12, marginBottom:27 }}>
        <MetricCard label="Total income" value={summary.income} kind="income" colors={colors} typography={typography} />
        <MetricCard label="Total expenses" value={summary.expenses} kind="expense" colors={colors} typography={typography} />
      </View>

      <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
        <View>
          <Text style={{ color:colors.text, fontSize:18, fontWeight:'800', fontFamily:typography.family }}>Recent activity</Text>
          <Text style={{ color:colors.muted, fontSize:12, marginTop:3, fontFamily:typography.family }}>Your latest money moves</Text>
        </View>
        {!!transactions.length && (
          <TouchableOpacity accessibilityRole="button" onPress={() => navigation.navigate('History')} style={{ padding:8 }}>
            <Text style={{ color:colors.primary, fontSize:13, fontWeight:'700', fontFamily:typography.family }}>See all</Text>
          </TouchableOpacity>
        )}
      </View>

      {transactions.slice(0,5).map(item => (
        <TransactionItem key={item._id} item={item} onPress={() => navigation.navigate('TransactionForm',{transaction:item})} />
      ))}

      {!loading && !transactions.length && (
        <Card style={{ alignItems:'center', paddingVertical:26, marginBottom:14 }}>
          <View style={{ width:48, height:48, borderRadius:17, backgroundColor:colors.surface2, alignItems:'center', justifyContent:'center', marginBottom:12 }}>
            <Text style={{ color:colors.primary, fontSize:23, fontWeight:'700' }}>↗</Text>
          </View>
          <Text style={{ color:colors.text, fontSize:15, fontWeight:'700', fontFamily:typography.family }}>Your story starts here</Text>
          <Text style={{ color:colors.muted, fontSize:13, textAlign:'center', marginTop:5, fontFamily:typography.family }}>
            Add your first income or expense to see your balance.
          </Text>
        </Card>
      )}

      <Button title="+   Add a report" onPress={() => navigation.navigate('TransactionForm')} style={{ marginTop:transactions.length?8:0 }} />
      <Text style={{ color:colors.muted, fontSize:12, textAlign:'center', marginTop:12, fontFamily:typography.family }}>
        Private by design · Your reports belong to you
      </Text>
    </Screen>
  );
}
