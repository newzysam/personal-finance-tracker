export function validateTransaction({ amount, type, name, date }) {
  const errors = {};
  const cleanName = name?.trim() || '';
  if (!cleanName) {
    errors.name = 'Name is required.';
  } else if (!/^\p{L}[\p{L}\p{M} .,'’&()-]*$/u.test(cleanName) || cleanName.length > 120) {
    errors.name = 'Start with a letter; use letters, spaces, and basic punctuation only (no numbers).';
  }
  if (!['income', 'expense'].includes(type)) errors.type = 'Choose Income or Expense.';

  const amountText = typeof amount === 'string' ? amount.trim() : String(amount ?? '');
  const amountValue = Number(amountText);
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(amountText) || !Number.isFinite(amountValue) || amountValue <= 0) {
    errors.amount = 'Amount must be a number greater than zero.';
  }

  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.date = 'Enter a valid date in YYYY-MM-DD format.';
  } else {
    const [year, month, day] = date.split('-').map(Number);
    const parsedDate = new Date(Date.UTC(year, month - 1, day));
    if (parsedDate.getUTCFullYear() !== year || parsedDate.getUTCMonth() !== month - 1 || parsedDate.getUTCDate() !== day) {
      errors.date = 'Enter a real calendar date.';
    }
  }
  return errors;
}
