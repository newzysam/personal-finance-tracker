const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const { validateReportInput } = require('../utils/reportValidation');

const router = express.Router();
router.use(auth);

// Calculate both totals and the balance on every request, never trusting client totals.
async function summarize(userId) {
  const rows = await Transaction.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: '$type', total: { $sum: '$amount' } } }
  ]);
  const totals = rows.reduce((acc, row) => ({ ...acc, [row._id]: row.total }), { income: 0, expense: 0 });
  return { income: totals.income, expenses: totals.expense, balance: totals.income - totals.expense };
}

router.get('/summary', async (req, res, next) => {
  try { res.json(await summarize(req.userId)); } catch (err) { next(err); }
});

router.get('/', async (req, res, next) => {
  try {
    const chronological = await Transaction.find({ user: req.userId }).sort({ date: 1, createdAt: 1, _id: 1 });
    let balance = 0;
    const withBalances = chronological.map(transaction => {
      balance += transaction.type === 'income' ? transaction.amount : -transaction.amount;
      return { ...transaction.toObject(), balanceAfter: balance };
    });
    res.json({ transactions: withBalances.reverse(), summary: await summarize(req.userId) });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { amount, type, name, date } = req.body;
    const errors = validateReportInput(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ message: Object.values(errors)[0], errors });
    const transaction = await Transaction.create({ user: req.userId, amount, type, name: name.trim(), date });
    res.status(201).json({ transaction, summary: await summarize(req.userId) });
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { amount, type, name, date } = req.body;
    const errors = validateReportInput(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ message: Object.values(errors)[0], errors });
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { amount, type, name: name.trim(), date },
      { new: true, runValidators: true }
    );
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ transaction, summary: await summarize(req.userId) });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted', summary: await summarize(req.userId) });
  } catch (err) { next(err); }
});

module.exports = router;
