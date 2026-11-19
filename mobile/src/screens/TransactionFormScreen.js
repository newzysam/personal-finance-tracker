import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Screen from './Screen';
import { useTheme } from '../context/ThemeContext';
import { useTransactions } from '../context/TransactionContext';
import { BrandMark, Button, Card, Field } from '../components/ui';
import { validateTransaction } from '../utils/validation';
import { isoDate } from '../utils/format';

export default function TransactionFormScreen({ route, navigation }) {
  const existing = route.params?.transaction;
  const { colors } = useTheme();
  const { create, update, remove } = useTransactions();
  const [amount, setAmount] = useState(existing ? String(existing.amount) : '');
  const [type, setType] = useState(existing?.type || 'expense');
  const [name, setName] = useState(existing?.name || '');
  const [date, setDate] = useState(existing ? isoDate(existing.date) : isoDate(new Date()));
  const [touched, setTouched] = useState({});
  const [serverErrors, setServerErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const validationErrors = validateTransaction({ amount, type, name, date });
  const isValid = Object.keys(validationErrors).length === 0;
  const fieldError = field => touched[field] ? (serverErrors[field] || validationErrors[field] || '') : '';
  const markTouched = field => setTouched(current => ({ ...current, [field]: true }));

  async function submit() {
    setTouched({ name: true, amount: true, date: true });
    setServerErrors({});
    setSubmitError('');
    if (!isValid) return;

    setLoading(true);
    try {
      const values = { amount: Number(amount), type, name: name.trim(), date };
      if (existing) await update(existing._id, values);
      else await create(values);
      navigation.goBack();
    } catch (error) {
      setServerErrors(error.errors || {});
      setSubmitError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    setLoading(true);
    setSubmitError('');
    try {
      await remove(existing._id);
      navigation.goBack();
    } catch (error) {
      setSubmitError(error.message);
      setConfirmingDelete(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen scroll contentStyle={{ paddingTop:22, paddingBottom:30 }}>
      <BrandMark compact />
      <Text style={{ color: colors.text, fontSize: 26, fontWeight: '800', letterSpacing:-0.5, marginTop:24 }}>
        {existing ? 'Edit report' : 'Add a report'}
      </Text>
      <Text style={{ color:colors.muted, fontSize:14, lineHeight:21, marginTop:6, marginBottom:20 }}>
        Record it once. Your totals and balance update automatically.
      </Text>
      <Card style={{ padding:18, marginBottom:16 }}>
      <Field
        label="Name"
        value={name}
        onChangeText={value => { setName(value); setServerErrors({}); }}
        onBlur={() => markTouched('name')}
        error={fieldError('name')}
        placeholder="e.g. Monthly salary, Market shopping"
        autoCapitalize="sentences"
        maxLength={120}
      />
      <Text style={{ color: colors.muted, fontSize: 12, lineHeight:18, marginTop: -8, marginBottom: 18 }}>
        Start with a letter; use letters, spaces, and basic punctuation only (no numbers).
      </Text>

      <Text style={{ color: colors.text, fontSize:13, fontWeight: '700', marginBottom: 8 }}>Transaction type</Text>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
        {['income', 'expense'].map(value => {
          const selected = type === value;
          const accent = value === 'income' ? colors.income : colors.expense;
          const accentSurface = value === 'income' ? colors.incomeSurface : colors.expenseSurface;
          return (
            <TouchableOpacity
              key={value}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setType(value)}
              style={{
                flex: 1, minHeight: 50, borderRadius: 13, alignItems: 'center', justifyContent: 'center',
                backgroundColor: selected ? accentSurface : colors.surface,
                borderWidth: 1.5, borderColor: selected ? accent : colors.border
              }}
            >
              <Text style={{ color: selected ? accent : colors.text, fontWeight: '700' }}>
                {value === 'income' ? 'Income' : 'Expense'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Field
        label="Amount"
        value={amount}
        onChangeText={value => { setAmount(value); setServerErrors({}); }}
        onBlur={() => markTouched('amount')}
        error={fieldError('amount')}
        keyboardType="decimal-pad"
        placeholder="0.00"
      />
      <Field
        label="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={value => { setDate(value); setServerErrors({}); }}
        onBlur={() => markTouched('date')}
        error={fieldError('date')}
        placeholder="2026-11-19"
      />

      </Card>
      {!isValid && (
        <Text style={{ color: colors.muted, fontSize:13, lineHeight:19, marginBottom: 10 }}>
          Complete the name and enter a valid type, positive amount, and date to save.
        </Text>
      )}
      {!!submitError && <Text accessibilityRole="alert" style={{ color: colors.danger, marginBottom: 10 }}>{submitError}</Text>}
      <Button
        title={existing ? 'Save changes' : 'Save report'}
        onPress={submit}
        loading={loading}
        disabled={!isValid}
      />

      {existing && (confirmingDelete ? (
        <>
          <Text style={{ color: colors.danger, marginTop: 14, marginBottom: 8 }}>
            Delete this report? This cannot be undone.
          </Text>
          <Button title="Confirm Delete" danger onPress={confirmDelete} loading={loading} />
          <Button title="Cancel" secondary onPress={() => setConfirmingDelete(false)} style={{ marginTop: 8 }} />
        </>
      ) : (
        <Button title="Delete report" danger onPress={() => setConfirmingDelete(true)} style={{ marginTop: 12 }} />
      ))}
    </Screen>
  );
}
