const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const sendResetCode = require('../utils/mailer');

const router = express.Router();

function tokenFor(user) {
  return jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
}

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    if (!name?.trim() || !normalizedEmail || !password) return res.status(400).json({ message: 'Name, email, and password are required' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return res.status(400).json({ message: 'Enter a valid email address' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
    if (password !== req.body.confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });
    if (await User.findOne({ email: normalizedEmail })) return res.status(409).json({ message: 'An account with this email already exists' });
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password });
    res.status(201).json({ token: tokenFor(user), user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid email or password' });
    res.json({ token: tokenFor(user), user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
});

router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (err) { next(err); }
});

router.post('/forgot-password', async (req, res, next) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const user = email ? await User.findOne({ email }).select('+resetTokenHash +resetTokenExpires') : null;
    if (!user) return res.status(404).json({ message: 'No account was found for that email. Check the address or create an account.' });
    const code = crypto.randomInt(100000, 1000000).toString();
    user.resetTokenHash = crypto.createHash('sha256').update(code).digest('hex');
    const expiresInMinutes = Number(process.env.RESET_TOKEN_EXPIRES_MINUTES || 30);
    user.resetTokenExpires = new Date(Date.now() + expiresInMinutes * 60000);
    await user.save({ validateBeforeSave: false });
    await sendResetCode(email, code);
    const response = { message: `Reset code created. It expires in ${expiresInMinutes} minutes.` };
    // Display the code only in local development when email delivery is not configured.
    if (!process.env.MAIL_HOST && (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test')) response.code = code;
    res.json(response);
  } catch (err) { next(err); }
});

router.post('/reset-password', async (req, res, next) => {
  try {
    const { email, code, password, confirmPassword } = req.body;
    if (!email || !code || !password || !confirmPassword) return res.status(400).json({ message: 'Email, code, and both password fields are required' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });
    const hash = crypto.createHash('sha256').update(code).digest('hex');
    const user = await User.findOne({ email: email.toLowerCase().trim(), resetTokenHash: hash, resetTokenExpires: { $gt: new Date() } }).select('+resetTokenHash +resetTokenExpires');
    if (!user) return res.status(400).json({ message: 'Invalid or expired reset code' });
    user.password = password;
    user.resetTokenHash = undefined;
    user.resetTokenExpires = undefined;
    await user.save();
    res.json({ message: 'Password reset successfully. You can now sign in.' });
  } catch (err) { next(err); }
});

module.exports = router;
