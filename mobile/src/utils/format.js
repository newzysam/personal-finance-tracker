export const money = value => new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(Number(value || 0));
export const dateLabel = value => {
  const [year, month, day] = String(value).slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};
export const isoDate = value => {
  if (typeof value === 'string') return value.slice(0, 10);
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};
