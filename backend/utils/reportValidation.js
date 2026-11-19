const NAME_PATTERN = /^\p{L}[\p{L}\p{M} .,'’&()-]*$/u;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(value) {
  if (typeof value !== 'string' || !DATE_PATTERN.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

function validateReportInput(body) {
  const errors = {};
  const name = typeof body.name === 'string' ? body.name.trim() : '';

  if (!name) {
    errors.name = 'Name is required.';
  } else if (name.length > 120 || !NAME_PATTERN.test(name)) {
    errors.name = 'Start with a letter; use letters, spaces, and basic punctuation only (no numbers).';
  }

  if (!['income', 'expense'].includes(body.type)) {
    errors.type = 'Choose Income or Expense.';
  }

  if (typeof body.amount !== 'number' || !Number.isFinite(body.amount) || body.amount <= 0) {
    errors.amount = 'Amount must be a number greater than zero.';
  }

  if (!isValidDate(body.date)) {
    errors.date = 'Enter a valid date in YYYY-MM-DD format.';
  }

  return errors;
}

module.exports = { NAME_PATTERN, isValidDate, validateReportInput };
